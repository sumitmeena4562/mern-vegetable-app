import Product from '../models/Product.js';
import { uploadToCloudinary } from '../middleware/upload.js';
import { getCoordinatesFromAddress } from '../utils/geocoding.js';

// Create product (Farmer only)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      variety,
      description,
      quantity,
      unit,
      pricePerUnit,
      organic,
      grade,
      harvestDate,
      expiryDate,
      location
    } = req.body;
    
    // Parse location if provided as string
    let coordinates = [0, 0];
    let locationData = {};
    
    if (location) {
      const geoResult = await getCoordinatesFromAddress(location);
      if (geoResult.success) {
        coordinates = geoResult.coordinates;
        locationData = {
          coordinates,
          address: location,
          city: req.user.address?.city || '',
          state: req.user.address?.state || '',
          pincode: req.user.address?.pincode || ''
        };
      }
    }
    
    // Create product
    const product = await Product.create({
      farmer: req.user.id,
      name,
      variety,
      description,
      quantity: parseFloat(quantity),
      unit,
      pricePerUnit: parseFloat(pricePerUnit),
      organic: organic === 'true' || organic === true,
      grade,
      harvestDate: new Date(harvestDate),
      expiryDate: new Date(expiryDate),
      location: {
        type: 'Point',
        coordinates,
        ...locationData
      },
      status: 'available'
    });
    
    // Upload images if provided
    if (req.files && req.files.images) {
      const images = [];
      
      for (const file of req.files.images) {
        const result = await uploadToCloudinary(file, 'farm2vendor/products');
        images.push({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: images.length === 0
        });
      }
      
      product.images = images;
      await product.save();
    }
    
    // Add product to farmer's active products
    if (req.user.userType === 'farmer') {
      req.user.activeProducts.push(product._id);
      await req.user.save();
    }
    
    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Get all products with filters
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
      radius = 50, // km
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;
    
    const query = { status: 'available' };
    
    if (category) query.category = category;
    if (name) query.name = { $regex: name, $options: 'i' }; // Search case-insensitive
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
            $geometry: {
              type: "Point",
              coordinates: [lng, lat]
            },
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
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'fullName profilePhoto farmName averageRating totalSales')
      .populate({
        path: 'farmer',
        populate: {
          path: 'activeProducts',
          select: 'name pricePerUnit quantity images',
          match: { status: 'available' }
        }
      });
    
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

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    
    delete updates.farmer;
    delete updates.soldQuantity;
    delete updates.views;
    delete updates.rating;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    
    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to update this product' });
    }
    
    if (req.files && req.files.images) {
      const images = [];
      for (const file of req.files.images) {
        const result = await uploadToCloudinary(file, 'farm2vendor/products');
        images.push({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: false
        });
      }
      updates.images = [...product.images, ...images];
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('farmer', 'fullName profilePhoto');
    
    res.status(200).json({ status: 'success', message: 'Product updated successfully', data: { product: updatedProduct } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update product', error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    
    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to delete this product' });
    }
    
    product.status = 'removed';
    await product.save();
    
    await req.user.updateOne({ $pull: { activeProducts: product._id } });
    
    res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete product', error: error.message });
  }
};

// Get farmer's products
export const getFarmerProducts = async (req, res) => {
  try {
    const farmerId = req.params.farmerId || req.user.id;
    const products = await Product.find({ 
      farmer: farmerId,
      status: { $ne: 'removed' }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ status: 'success', data: { products } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch farmer products', error: error.message });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { q, location, radius = 50 } = req.query;
    const query = {
      status: 'available',
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { variety: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    };
    
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
    
    const products = await Product.find(query)
      .populate('farmer', 'fullName profilePhoto averageRating')
      .limit(20);
    
    res.status(200).json({ status: 'success', data: { products } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to search products', error: error.message });
  }
};