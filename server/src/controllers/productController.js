import Product from '../models/Product.js';
import { uploadToCloudinary, cloudinary } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';
// Removed unused import if not needed, but keeping for compatibility
// import { getCoordinatesFromAddress } from '../utils/geocoding.js';

/**
 * @desc    Create product (Farmer only)
 */
export const createProduct = async (req, res) => {
  try {
    let productData = req.body;
    if (req.body.productData) {
      try {
        productData = JSON.parse(req.body.productData);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid productData JSON' });
      }
    }

    const {
      name,
      variety,
      description,
      quantity,
      unit,
      pricePerUnit,
      organic,
      grade,
      qualityGrade,
      harvestDate,
      expiryDate,
      location,
      minimumOrder,
      status,
      tags
    } = productData;

    let locationData = { type: 'Point', coordinates: [0, 0] };
    if (location && location.coordinates) {
      locationData = {
        type: 'Point',
        coordinates: location.coordinates,
        address: location.address || '',
        city: location.city || req.user.address?.city || '',
        state: location.state || req.user.address?.state || '',
        pincode: location.pincode || req.user.address?.pincode || ''
      };
    }

    const hDate = new Date(harvestDate || Date.now());
    const eDate = expiryDate ? new Date(expiryDate) : new Date(hDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const product = await Product.create({
      farmer: req.user.id,
      name: name, // Preserving original casing as per user request
      variety,
      description,
      quantity: parseFloat(quantity),
      unit: unit || 'kg',
      pricePerUnit: parseFloat(pricePerUnit),
      organic: organic === 'true' || organic === true,
      grade: grade || qualityGrade || 'A',
      harvestDate: hDate,
      expiryDate: eDate,
      location: locationData,
      minimumOrder: parseFloat(minimumOrder) || 1,
      status: status || 'available',
      tags: tags || []
    });

    if (req.files && req.files.length > 0) {
      const images = [];

      for (const file of req.files) {
        try {
          // DIRECT Upload from Memory to Cloudinary
          const result = await uploadToCloudinary(file.buffer, 'agriconnect/products');
          images.push({
            url: result.secure_url,
            publicId: result.public_id,
            isPrimary: images.length === 0
          });
        } catch (uploadError) {
          console.error("Cloudinary Upload Failed:", uploadError.message);
          // Skipping image if Cloudinary fails since local storage is strictly disabled
        }
      }
      if (images.length > 0) {
        product.images = images;
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

/**
 * @desc    Get all products with filters
 */
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      name,
      minPrice,
      maxPrice,
      organic,
      farmerId,
      status,
      location,
      radius = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = { status: 'available' };

    if (category) query.category = category;
    if (name) query.name = { $regex: name, $options: 'i' };
    if (organic) query.organic = organic === 'true';
    if (farmerId) query.farmer = farmerId;
    if (status) query.status = status;

    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = parseFloat(maxPrice);
    }

    if (location) {
      const [lng, lat] = location.split(',').map(Number);
      if (!isNaN(lng) && !isNaN(lat)) {
        query.location = {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: radius * 1000
          }
        };
      }
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .populate('farmer', 'fullName profilePhoto averageRating')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

/**
 * @desc    Get single product
 */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'fullName profilePhoto farmName averageRating totalSales');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.views += 1;
    await product.save();

    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message });
  }
};

/**
 * @desc    Update product
 */
export const updateProduct = async (req, res) => {
  try {
    let updates = req.body;

    if (req.body.productData) {
      try {
        updates = JSON.parse(req.body.productData);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid productData JSON' });
      }
    }

    delete updates.farmer;
    delete updates.soldQuantity;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Handle existing images
    if (updates.images !== undefined) {
      if (typeof updates.images === 'string') {
        try {
          updates.images = JSON.parse(updates.images);
        } catch (e) {
          updates.images = product.images; // fallback
        }
      }

      // Delete removed images from Cloudinary
      const keptPublicIds = updates.images.map(img => img.publicId);
      for (const oldImg of product.images) {
        if (!keptPublicIds.includes(oldImg.publicId) && oldImg.publicId && oldImg.publicId !== 'local') {
          try {
            await cloudinary.uploader.destroy(oldImg.publicId);
            console.log("Deleted old Cloudinary image:", oldImg.publicId);
          } catch (err) {
            console.error("Failed to delete Cloudinary image:", oldImg.publicId, err);
          }
        }
      }
    } else {
      updates.images = product.images;
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer, 'agriconnect/products');
          newImages.push({
            url: result.secure_url,
            publicId: result.public_id,
            isPrimary: updates.images.length === 0 && newImages.length === 0
          });
        } catch (uploadError) {
          console.error("Cloudinary Upload Failed:", uploadError.message);
        }
      }
      updates.images = [...(updates.images || []), ...newImages];
    }

    // Fix location format if sent
    if (updates.location && updates.location.coordinates) {
      updates.location = {
        type: 'Point',
        coordinates: updates.location.coordinates,
        address: updates.location.address || product.location.address || '',
        city: updates.location.city || req.user.address?.city || '',
        state: updates.location.state || req.user.address?.state || '',
        pincode: updates.location.pincode || req.user.address?.pincode || ''
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: { product: updatedProduct } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

/**
 * @desc    Delete product (Hard delete)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Cleanup images from Cloudinary & Local (for older products)
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        // 1. Delete from Cloudinary
        if (img.publicId && img.publicId !== 'local') {
          try {
            await cloudinary.uploader.destroy(img.publicId);
            console.log(`Deleted from Cloudinary: ${img.publicId}`);
          } catch (err) {
            console.error(`Failed to delete from Cloudinary: ${img.publicId}`, err);
          }
        }

        // 2. Local cleanup for backward compatibility
        if (img.publicId === 'local' && img.url.startsWith('/uploads/')) {
          const filename = img.url.split('/').pop();
          const filePath = path.join(process.cwd(), 'uploads', filename);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error(`Failed to delete local file: ${filePath}`, err);
            }
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Product deleted permanently' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

/**
 * @desc    Get farmer's own products
 */
export const getFarmerProducts = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { status, page = 1, limit = 10, search } = req.query;
    let query = { farmer: farmerId, status: { $ne: 'removed' } };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { variety: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

/**
 * @desc    Update product status
 */
export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['available', 'sold', 'reserved', 'expired'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
};

/**
 * @desc    Search products
 */
export const searchProducts = async (req, res) => {
  try {
    const { q, location, radius = 50 } = req.query;
    const query = {
      status: 'available',
      $or: [
        { name: { $regex: q || '', $options: 'i' } },
        { variety: { $regex: q || '', $options: 'i' } }
      ]
    };

    const products = await Product.find(query)
      .populate('farmer', 'fullName profilePhoto averageRating')
      .limit(20);

    res.status(200).json({ success: true, data: { products } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed', error: error.message });
  }
};