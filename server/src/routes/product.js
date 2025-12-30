import express from 'express';
import * as productController from '../controllers/productController.js'; // .js extension zaroori hai
import auth from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';
import validate from '../middleware/validation.js';
import { body } from 'express-validator';

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProduct);
router.get('/farmer/:farmerId', productController.getFarmerProducts);

// Protected routes (Farmer only for create/update/delete)
router.post('/', 
  auth('farmer'),
  uploadMultiple('images', 5),
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('quantity').isFloat({ min: 0.1 }).withMessage('Valid quantity is required'),
    body('pricePerUnit').isFloat({ min: 1 }).withMessage('Valid price is required'),
    body('harvestDate').isISO8601().withMessage('Valid harvest date is required')
  ],
  validate,
  productController.createProduct
);

router.put('/:id',
  auth('farmer'),
  uploadMultiple('images', 5),
  productController.updateProduct
);

router.delete('/:id', auth('farmer'), productController.deleteProduct);

// Get farmer's own products
router.get('/my/products', auth('farmer'), productController.getFarmerProducts);

export default router; // exports ki jagah export default