import express from "express";
import {
    login,
    getUserName,
    getMe,
    getProfile,
    sendOtp,
    verifyOtp,
    sendForgotPasswordOtp,
    verifyResetOtp,
    resetPasswordWithOtp,
    loginWithOtp,
    getCart,
    syncCart
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
const router = express.Router();


// Existing routes
router.post("/login", login);


// ✅ New Route add karo (Auth middleware ke saath)
router.get("/user-name", auth(), getUserName);


router.get('/me', auth(), getMe);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login-with-otp', loginWithOtp);
// Forgot Password Routes
router.post('/forgot-password-otp', sendForgotPasswordOtp);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password-with-otp', auth(), resetPasswordWithOtp);

// Unified Profile Route (Restored)
router.get('/profile', auth(), getProfile);

// Cart Routes
router.get('/cart', auth(), getCart);
router.post('/cart/sync', auth(), syncCart);

export default router;