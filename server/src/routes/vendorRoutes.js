import express from 'express';
import {
    validateCreateVendor,
    registerVendor,
    getMyProfile,
    updateProfile
} from '../controllers/vendorController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public: Registration
router.post('/register', validateCreateVendor, registerVendor);

// Protected: Profile Management
router.get('/profile', auth('vendor'), getMyProfile);
router.put('/profile', auth('vendor'), updateProfile);

export default router;
