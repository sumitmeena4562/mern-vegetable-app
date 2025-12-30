// file: models/Vendor.js
import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  shopName: {
    type: String,
    required: [true, 'Please provide your shop name'],
    trim: true,
    maxlength: [200, 'Shop name cannot be more than 200 characters']
  },
  
  businessType: {
    type: String,
    enum: ['retailer', 'wholesaler', 'restaurant', 'hotel', 'caterer', 'other'],
    default: 'retailer'
  },
  
  gstNumber: { 
    type: String, 
    trim: true,
    uppercase: true
  },
  
  businessLicense: {
    number: String,
    document: String,
    verified: { type: Boolean, default: false }
  },
  
  dailyCapacity: {
    type: Number,
    required: [true, 'Please provide daily buying capacity'],
    min: [1, 'Daily capacity must be at least 1 kg']
  },
  
  preferredVegetables: [{
    type: String,
    enum: ['tomato', 'potato', 'onion', 'carrot', 'spinach', 'cauliflower', 
           'brinjal', 'chili', 'cabbage', 'okra', 'cucumber', 'all']
  }],
  
  paymentTerms: {
    type: String,
    enum: ['cod', 'online', 'credit_7', 'credit_15', 'credit_30'],
    default: 'online'
  },
  
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  
  totalPurchases: {
    type: Number,
    default: 0
  },
  
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String,
    verified: { type: Boolean, default: false }
  },
  
  storeTimings: {
    open: { type: String, default: '06:00' },
    close: { type: String, default: '22:00' }
  },
  
  preferredPickupTime: {
    type: String,
    enum: ['early_morning', 'morning', 'afternoon', 'evening'],
    default: 'morning'
  },
  
  warehouseAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: [Number]
  },
  
  creditLimit: {
    type: Number,
    default: 0
  },
  
  currentCreditUsed: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true
});

// Indexes
vendorSchema.index({ businessType: 1 });
vendorSchema.index({ 'warehouseAddress.coordinates': '2dsphere' });

// Middleware to update user role
vendorSchema.pre('save', async function(next) {
  if (this.isNew) {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(this.user, { role: 'vendor' });
  }
  next();
});

export default mongoose.model('Vendor', vendorSchema);