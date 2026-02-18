import express from 'express';
import {
    validateCreateFarmer,
    registerFarmer,
    getMyProfile,
    updateProfile,
    getDashboardStats,
    completeOnboarding
} from '../controllers/farmerController.js';
import { createProduct } from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public: Registration
router.post('/register', validateCreateFarmer, registerFarmer);

// Protected: Profile Management
router.get('/profile', auth('farmer'), getMyProfile);
router.put('/profile', auth('farmer'), updateProfile);
router.get('/stats', auth('farmer'), getDashboardStats);
router.put('/complete-onboarding', auth('farmer'), completeOnboarding);

// Protected: Product Management
router.post('/products', auth('farmer'), uploadMultiple('images', 5), createProduct);

export default router;
