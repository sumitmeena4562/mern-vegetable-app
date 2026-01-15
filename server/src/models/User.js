// file: models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },

  mobile: {
    type: String,
    required: [true, 'Please provide your mobile number'],
    unique: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number']
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },

  role: {
    type: String,
    enum: ['farmer', 'vendor', 'customer', 'admin'],
    required: true
  },

  profilePhoto: {
    type: String,
    default: 'https://res.cloudinary.com/farm2vendor/image/upload/v1/defaults/profile.png'
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
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

  address: {
    village: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
    fullAddress: String
  },

  otp: {
    code: String,
    expiresAt: Date
  },

  fcmToken: String,

  lastLogin: Date,

  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'english' }
  }

}, {
  timestamps: true
});

// Indexes
userSchema.index({ location: '2dsphere' });
userSchema.index({ role: 1, isActive: 1 });

// Hash password
userSchema.pre('save', async function () {
  console.log("🔄 User pre-save hook called");

  // Check if password is modified
  if (!this.isModified('password')) {
    console.log("Password not modified, skipping hash");
    return; // ✅ Just return, no next() needed
  }

  try {
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully");
    // ✅ No need to call next() in async functions in Mongoose v6+
  } catch (error) {
    console.error("Password hash error:", error);
    throw error; // ✅ Throw error instead of calling next(error)
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Virtual for getting role-specific data
userSchema.virtual('profile', {
  ref: function () {
    // Dynamic reference based on role
    if (this.role === 'farmer') return 'Farmer';
    if (this.role === 'customer') return 'Customer';
    if (this.role === 'vendor') return 'Vendor';
    if (this.role === 'admin') return 'Admin';
    return null;
  },
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

export default mongoose.model('User', userSchema);