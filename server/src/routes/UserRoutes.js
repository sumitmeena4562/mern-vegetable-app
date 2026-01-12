import express from "express";
import {
    login,
    register,
    getUserName,
    getMe,
    getProfile,
    sendOtp,
    verifyOtp,
    sendForgotPasswordOtp,
    verifyResetOtp,
    resetPasswordWithOtp,
    loginWithOtp
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
const router = express.Router();


// Existing routes
router.post("/login", login);


// ✅ New Route add karo (Auth middleware ke saath)
router.get("/user-name", auth(), getUserName);

router.post('/register/farmer', register);


router.get('/me', auth(), getMe);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login-with-otp', loginWithOtp);
// Forgot Password Routes
router.post('/forgot-password-otp', sendForgotPasswordOtp);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password-with-otp', auth(), resetPasswordWithOtp);

router.get('/profile', auth(), getProfile);



export default router;