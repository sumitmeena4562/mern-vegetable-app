import Product from '../models/Product.js';
import { uploadToCloudinary } from '../middleware/upload.js';
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
        return res.status(400).json({ status: 'error', message: 'Invalid productData JSON' });
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
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      for (const file of req.files) {
        try {
          // 1. Try Cloudinary Upload
          const result = await uploadToCloudinary(file.path, 'farm2vendor/products');
          images.push({
            url: result.secure_url,
            publicId: result.public_id,
            isPrimary: images.length === 0
          });
          // Optional: Cleanup local file after successful upload to Cloudinary
          // fs.unlinkSync(file.path); 
        } catch (uploadError) {
          console.error("Cloudinary Upload Failed, falling back to local storage:", uploadError.message);

          // 2. Fallback to Local URL (Best for proxies/ngrok)
          images.push({
            url: `/uploads/${file.filename}`, // Clean relative URL
            publicId: 'local',
            isPrimary: images.length === 0
          });
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
      status: 'success',
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
    res.status(500).json({ status: 'error', message: 'Failed to fetch products', error: error.message });
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
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    product.views += 1;
    await product.save();

    res.status(200).json({ status: 'success', data: { product } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch product', error: error.message });
  }
};

/**
 * @desc    Update product
 */
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.farmer;
    delete updates.soldQuantity;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: { product: updatedProduct } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Update failed', error: error.message });
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

    // Cleanup local files if any
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
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
        // Note: For Cloudinary cleanup, we would use cloudinary.uploader.destroy(img.publicId)
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
    const { status } = req.query;
    let query = { farmer: farmerId, status: { $ne: 'removed' } };

    if (status && status !== 'all') {
      query.status = status;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
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

    res.status(200).json({ status: 'success', data: { products } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Search failed', error: error.message });
  }
};