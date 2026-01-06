import twilio from 'twilio';
import User from '../models/User.js';
import { sendMail } from './sendMail.js';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate random OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
export const sendOTPViaSMS = async (mobile, otp) => {
  try {
    const message = await twilioClient.messages.create({
      body: `Your AgriConnect OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobile}`
    });

    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('SMS OTP Error:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP via Email
export const sendOTPViaEmail = async (email, otp) => {
  try {
    // Uses the dynamic template logic from sendMail.js
    const result = await sendMail(email, 'OTP', { otp });
    return result;
  } catch (error) {
    console.error('Email OTP Error:', error);
    return { success: false, error: error.message };
  }
};

// Save OTP to user
export const saveOTPToUser = async (userId, otp) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRE_MINUTES || '10'));

  await User.findByIdAndUpdate(userId, {
    'otp.code': otp,
    'otp.expiresAt': expiresAt
  });
};

// Verify OTP
export const verifyOTP = async (userId, otp) => {
  const user = await User.findById(userId);

  if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
    return { valid: false, message: 'OTP not found' };
  }

  if (new Date() > user.otp.expiresAt) {
    return { valid: false, message: 'OTP expired' };
  }

  if (user.otp.code !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }

  // Clear OTP after successful verification
  await User.findByIdAndUpdate(userId, {
    $unset: { otp: 1 },
    isVerified: true
  });

  return { valid: true };
};

export default {
  generateOTP,
  sendOTPViaSMS,
  sendOTPViaEmail,
  saveOTPToUser,
  verifyOTP
};