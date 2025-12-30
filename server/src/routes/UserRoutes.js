import express from "express";
import { login, getUserName,register,getMe } from "../controllers/userController.js"; // getUserName import karo
import auth from "../middleware/auth.js"; // Auth middleware import karo

const router = express.Router();

// Existing routes
router.post("/login", login);

// ✅ New Route add karo (Auth middleware ke saath)
router.get("/user-name", auth(), getUserName);

router.post('/register/farmer', register);

router.get('/me', auth(), getMe);


export default router;