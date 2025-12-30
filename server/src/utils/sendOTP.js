const twilio = require('twilio');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
const sendOTPViaSMS = async (mobile, otp) => {
  try {
    const message = await twilioClient.messages.create({
      body: `Your Farm2Vendor OTP is: ${otp}. Valid for 10 minutes.`,
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
const sendOTPViaEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Farm2Vendor - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Farm2Vendor</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Fresh from Farm to Home</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">OTP Verification</h2>
            <p style="color: #666; line-height: 1.6;">
              Use the following OTP to verify your account. This OTP is valid for 10 minutes.
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; border: 2px solid #e8f3ec;">
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #16a34a;">${otp}</div>
            </div>
            
            <p style="color: #999; font-size: 12px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email OTP Error:', error);
    return { success: false, error: error.message };
  }
};

// Save OTP to user
const saveOTPToUser = async (userId, otp) => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRE_MINUTES));
  
  await User.findByIdAndUpdate(userId, {
    'otp.code': otp,
    'otp.expiresAt': expiresAt
  });
};

// Verify OTP
const verifyOTP = async (userId, otp) => {
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

module.exports = {
  generateOTP,
  sendOTPViaSMS,
  sendOTPViaEmail,
  saveOTPToUser,
  verifyOTP
};