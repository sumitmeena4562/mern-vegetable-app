// file: models/Customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  preferences: [{
    vegetable: String,
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly'] 
    },
    quantity: Number,
    unit: String
  }],
  
  deliveryInstructions: String,
  
  familySize: {
    type: Number,
    min: 1,
    default: 1
  },
  
  averageMonthlySpend: {
    type: Number,
    min: 0,
    default: 0
  },
  
  totalOrders: {
    type: Number,
    default: 0
  },
  
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  
  subscription: {
    type: String,
    enum: ['none', 'basic', 'premium', 'family'],
    default: 'none'
  },
  
  deliveryAddresses: [{
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
    coordinates: [Number],
    isDefault: { type: Boolean, default: false }
  }],
  
  paymentMethods: [{
    type: { 
      type: String, 
      enum: ['upi', 'card', 'netbanking', 'wallet'] 
    },
    details: mongoose.Schema.Types.Mixed,
    isDefault: { type: Boolean, default: false }
  }],
  
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
  
}, {
  timestamps: true
});

// Indexes
customerSchema.index({ loyaltyPoints: -1 });

// Middleware to update user role
customerSchema.pre('save', async function(next) {
  if (this.isNew) {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(this.user, { role: 'customer' });
  }
  next();
});

export default mongoose.model('Customer', customerSchema);