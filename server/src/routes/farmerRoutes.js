import express from 'express';
import {
    validateCreateFarmer,
    registerFarmer,
    getMyProfile,
    updateProfile
} from '../controllers/farmerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public: Registration
router.post('/register', validateCreateFarmer, registerFarmer);

// Protected: Profile Management
router.get('/profile', auth('farmer'), getMyProfile);
router.put('/profile', auth('farmer'), updateProfile);

export default router;
