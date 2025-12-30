import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    enum: ['tomato', 'potato', 'onion', 'carrot', 'spinach', 'cauliflower', 
           'brinjal', 'chili', 'cabbage', 'okra', 'cucumber', 'other']
  },
  
  variety: String,
  
  category: {
    type: String,
    enum: ['vegetable', 'fruit', 'herb', 'other'],
    default: 'vegetable'
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  
  images: [{
    url: String,
    publicId: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: [1, 'Quantity must be at least 1 kg']
  },
  
  unit: {
    type: String,
    enum: ['kg', 'dozen', 'bunch', 'piece'],
    default: 'kg'
  },
  
  pricePerUnit: {
    type: Number,
    required: [true, 'Please provide price per unit'],
    min: [1, 'Price must be at least ₹1']
  },
  
  organic: {
    type: Boolean,
    default: false
  },
  
  grade: {
    type: String,
    enum: ['A', 'B', 'C'],
    default: 'A'
  },
  
  harvestDate: {
    type: Date,
    required: [true, 'Please provide harvest date']
  },
  
  expiryDate: {
    type: Date,
    required: [true, 'Please provide expiry date']
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'expired', 'removed'],
    default: 'available'
  },
  
  tags: [String],
  
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  minimumOrder: {
    type: Number,
    default: 1
  },
  
  maximumOrder: {
    type: Number
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  soldQuantity: {
    type: Number,
    default: 0
  },
  
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ location: '2dsphere' });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ farmer: 1, status: 1 });

// Virtual for available quantity
productSchema.virtual('availableQuantity').get(function() {
  return this.quantity - this.soldQuantity;
});

// Check availability method
productSchema.methods.isAvailable = function(requiredQuantity) {
  return this.status === 'available' && 
         (this.quantity - this.soldQuantity) >= requiredQuantity;
};

const Product = mongoose.model('Product', productSchema);
export default Product;