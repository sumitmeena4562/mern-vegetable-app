import express from 'express';
import {
    validateCreateFarmer,
    registerFarmer,
    getMyProfile,
    updateProfile,
    getDashboardStats,
    getFarmerAnalytics,
    completeOnboarding
} from '../controllers/farmerController.js';
import {
    getWalletStats,
    getTransactionHistory,
    requestWithdrawal
} from '../controllers/walletController.js';
import {
    getFarmerOrders,
    getOrderDetails,
    updateOrderStatus,
    verifyDeliveryOtp
} from '../controllers/orderController.js';
import {
    createProduct,
    getFarmerProducts,
    updateProduct,
    updateProductStatus,
    deleteProduct,
    bulkUpdateProductStatus,
    bulkDeleteProducts
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public: Registration
router.post('/register', validateCreateFarmer, registerFarmer);

// Protected: Profile Management
router.get('/profile', auth('farmer'), getMyProfile);
router.put('/profile', auth('farmer'), updateProfile);
router.get('/stats', auth('farmer'), getDashboardStats);
router.get('/analytics', auth('farmer'), getFarmerAnalytics);
router.put('/complete-onboarding', auth('farmer'), completeOnboarding);

// Protected: Product Management
router.post('/products', auth('farmer'), uploadMultiple('images', 5), createProduct);
router.get('/products', auth('farmer'), getFarmerProducts);
router.put('/products/bulk-status', auth('farmer'), bulkUpdateProductStatus);
router.post('/products/bulk-delete', auth('farmer'), bulkDeleteProducts);
router.put('/products/:id', auth('farmer'), uploadMultiple('images', 5), updateProduct);
router.put('/products/:id/status', auth('farmer'), updateProductStatus);
router.delete('/products/:id', auth('farmer'), deleteProduct);

// Protected: Wallet & Finance
router.get('/wallet/stats', auth('farmer'), getWalletStats);
router.get('/wallet/transactions', auth('farmer'), getTransactionHistory);
router.post('/wallet/withdraw', auth('farmer'), requestWithdrawal);

// Protected: Order Management
router.get('/orders', auth('farmer'), getFarmerOrders);
router.get('/orders/:id', auth('farmer'), getOrderDetails);
router.put('/orders/:id/status', auth('farmer'), updateOrderStatus);
router.put('/orders/:id/verify-delivery', auth('farmer'), verifyDeliveryOtp);

export default router;
