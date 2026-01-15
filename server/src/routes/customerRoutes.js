import express from 'express';
import {
    validateCreateCustomer,
    registerCustomer,
    getMyProfile
} from '../controllers/customerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public: Registration
router.post('/register', validateCreateCustomer, registerCustomer);

// Protected: Profile Management
router.get('/profile', auth('customer'), getMyProfile);

export default router;
