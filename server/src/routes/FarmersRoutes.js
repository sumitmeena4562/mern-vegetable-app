// routes/farmers.js
import express from 'express';
import { 
  createFarmer,
  getFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
  getFarmerProducts,
  getFarmerOrders,
  getFarmerStats,
  validateCreateFarmer 
} from '../controllers/farmerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ✅ Public routes
router.post('/register', validateCreateFarmer, createFarmer); // Farmer registration
router.get('/', getFarmers); // List all farmers (for customers/vendors)
router.get('/:id', getFarmerById); // Get specific farmer details

// ✅ Protected routes (Farmer only)
router.put('/profile', auth('farmer'), updateFarmer); // Update own profile
router.delete('/profile', auth('farmer'), deleteFarmer); // Delete own account (soft delete)

// ✅ Farmer-specific routes (Protected)
router.get('/:id/products', getFarmerProducts); // Get farmer's products
router.get('/:id/orders', auth('farmer'), getFarmerOrders); // Get farmer's orders
router.get('/:id/stats', auth('farmer'), getFarmerStats); // Get farmer stats

// ✅ Admin routes
router.put('/:id/admin', auth('admin'), updateFarmer); // Admin update farmer
router.delete('/:id/admin', auth('admin'), deleteFarmer); // Admin delete farmer

export default router;