import express from 'express';
import {
    validateCreateFarmer,
    registerFarmer,
    getMyProfile,
    updateProfile,
    getDashboardStats,
    completeOnboarding
} from '../controllers/farmerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public: Registration
router.post('/register', validateCreateFarmer, registerFarmer);

// Protected: Profile Management
router.get('/profile', auth('farmer'), getMyProfile);
router.put('/profile', auth('farmer'), updateProfile);
router.get('/stats', auth('farmer'), getDashboardStats);
router.put('/complete-onboarding', auth('farmer'), completeOnboarding);

export default router;
