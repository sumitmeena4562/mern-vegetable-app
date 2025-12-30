import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  farmName: {
    type: String,
    required: [true, 'Please provide your farm name'],
    trim: true,
    maxlength: [200, 'Farm name cannot be more than 200 characters'],
    default: 'My Farm'
  },
  
  farmSize: {
    type: Number,
    required: [true, 'Please provide farm size'],
    min: [0.1, 'Farm size must be at least 0.1 acre'],
    default: 1
  },
  
  farmSizeUnit: {
    type: String,
    enum: ['acre', 'hectare', 'bigha'],
    default: 'acre'
  },

  // ✅ FIX: Location Field add kiya (Bohot Zaruri hai)
  location: {
    type: { 
      type: String, 
      enum: ['Point'], 
      default: 'Point' 
    },
    coordinates: { 
      type: [Number], 
      default: [0, 0] 
    }
  },
  
  crops: [{
    name: {
      type: String,
      required: true,
      // ✅ FIX: 'leafyVeg' aur 'others' add kiya taaki error na aaye
      enum: ['tomato', 'potato', 'onion', 'carrot', 'spinach', 'cauliflower', 
             'brinjal', 'chili', 'cabbage', 'okra', 'cucumber', 'leafyVeg', 'others', 'other']
    },
    variety: String,
    season: String,
    organic: { type: Boolean, default: false }
  }],
  
  farmingExperience: { 
    type: Number, 
    min: 0, 
    default: 0 
  },
  
  kycVerified: { 
    type: Boolean, 
    default: false 
  },
  
  averageRating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
  },
  
  totalSales: { 
    type: Number, 
    default: 0 
  },
  
  preferredPickupTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'any'],
    default: 'morning'
  },
  
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String,
    verified: { type: Boolean, default: false }
  },
  
  documents: [{
    type: { type: String, enum: ['aadhar', 'pan', 'land_document', 'license'] },
    number: String,
    fileUrl: String,
    verified: { type: Boolean, default: false }
  }]
  
}, {
  timestamps: true
});

// Indexes
farmerSchema.index({ location: '2dsphere' });

export default mongoose.model('Farmer', farmerSchema);