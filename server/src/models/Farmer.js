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

  farmingType: {
    type: String,
    enum: ['organic', 'natural', 'regular', 'hydroponic'],
    default: 'regular'
  },

  soilType: {
    type: String,
    enum: ['black', 'red', 'alluvial', 'sandy', 'clay', 'other'],
    default: 'other'
  },

  irrigationSystem: {
    type: String,
    enum: ['drip', 'sprinkler', 'tubewell', 'canal', 'manual'],
    default: 'manual'
  },

  waterSource: {
    type: String,
    enum: ['borewell', 'river', 'canal', 'rainwater', 'well'],
    default: 'well'
  },

  hasColdStorage: {
    type: Boolean,
    default: false
  },

  landOwnership: {
    type: String,
    enum: ['owned', 'leased'],
    default: 'owned'
  },

  farmPhotos: [String],

  primaryCrop: {
    type: String,
    trim: true,
    placeholder: 'e.g. Tomato Specialist'
  },

  crops: [{
    name: {
      type: String,
      required: true
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

  onboardingComplete: {
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

  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },

  pendingPayouts: {
    type: Number,
    default: 0,
    min: 0
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
farmerSchema.index({ user: 1 });

export default mongoose.model('Farmer', farmerSchema);