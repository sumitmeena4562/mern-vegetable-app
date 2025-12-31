// file: src/routes/auth.js (UPDATE THIS FILE)
import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  test,
  validateRegister,
  validateLogin
} from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// ✅ ADD THIS ROUTE
router.post('/register', validateRegister, register);

// Existing routes
router.post('/register/farmer', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.get('/test', test);

export default router;