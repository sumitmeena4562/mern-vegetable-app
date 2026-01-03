import express from 'express';
import { registerFarmer, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register/farmer', registerFarmer);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;