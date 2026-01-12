import express from "express";
import {
    login,
    register,
    getUserName,
    getMe,
    getProfile,
    sendOtp,
    verifyOtp
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

router.get('/profile', auth(), getProfile);



export default router;