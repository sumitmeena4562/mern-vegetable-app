import express from 'express';
import {
    validateCreateVendor,
    registerVendor,
    getMyProfile,
    updateProfile,
    getDashboardStats,
    completeOnboarding
} from '../controllers/vendorController.js';
import { getProducts, searchProducts, getProduct } from '../controllers/productController.js';
import { getMarketTrends } from '../controllers/priceController.js';
import { getVendorOrders, getVendorOrder, createOrder, cancelOrder, addOrderReview } from '../controllers/orderController.js';
import { getVendorWalletStats, getVendorTransactions } from '../controllers/walletController.js';
import auth from '../middleware/auth.js';

import upload from '../middleware/upload.js';

const router = express.Router();

// Public: Registration
router.post('/register', upload.array('shopPhotos', 3), validateCreateVendor, registerVendor);

// Protected: Profile Management
router.get('/profile', auth('vendor'), getMyProfile);
router.put('/profile', auth('vendor'), updateProfile);
router.get('/stats', auth('vendor'), getDashboardStats);
router.put('/complete-onboarding', auth('vendor'), completeOnboarding);

// Protected: Market Products & Trends
router.get('/products', auth('vendor'), getProducts);
router.get('/products/search', auth('vendor'), searchProducts);
router.get('/market-trends', auth('vendor'), getMarketTrends);
router.get('/products/:id', auth('vendor'), getProduct);

// Protected: Vendor Orders (Purchase History)
router.get('/orders', auth('vendor'), getVendorOrders);
router.get('/orders/:id', auth('vendor'), getVendorOrder);
router.post('/orders', auth('vendor'), createOrder);
router.put('/orders/:id/cancel', auth('vendor'), cancelOrder);
router.put('/orders/:id/review', auth('vendor'), addOrderReview);

// Protected: Vendor Finance
router.get('/wallet/stats', auth('vendor'), getVendorWalletStats);
router.get('/wallet/transactions', auth('vendor'), getVendorTransactions);

export default router;
