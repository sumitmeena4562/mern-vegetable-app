import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    mobile: {
    type: String,
    sparse: true  // 'required: true' hata dein
  },
  email: {        // Email field add karein
    type: String,
    sparse: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 300 seconds (5 minutes) ke baad apne aap delete ho jayega
  }
});

export default mongoose.model('Otp', otpSchema);