import { body, validationResult } from 'express-validator';
import {
  createFarmerService,
  getFarmerService,
  updateFarmerService,
  deleteFarmerService,
  listFarmersService
} from '../services/farmerService.js';

// Validation stays in Controller because it's related to HTTP Request formatting
export const validateCreateFarmer = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number is required')
];

/**
 * Controller: FarmerController
 * Responsibility: Handle HTTP Request/Response, parse inputs, and call Service.
 */

export const createFarmer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    // Call Service
    const farmer = await createFarmerService(req.body);
    return res.status(201).json({ success: true, data: farmer });

  } catch (err) {
    console.error('createFarmer error:', err);
    // Handle specific service errors (like duplication)
    if (err.message === 'Mobile already registered') {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Failed to create farmer', error: err.message });
  }
};

export const getFarmer = async (req, res) => {
  try {
    const farmer = await getFarmerService(req.params.id);
    return res.status(200).json({ success: true, data: farmer });
  } catch (err) {
    if (err.message === 'Farmer not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Failed to fetch farmer', error: err.message });
  }
};

export const updateFarmer = async (req, res) => {
  try {
    const farmer = await updateFarmerService(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Updated successfully', data: farmer });
  } catch (err) {
    if (err.message === 'Farmer not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Failed to update farmer', error: err.message });
  }
};

export const deleteFarmer = async (req, res) => {
  try {
    await deleteFarmerService(req.params.id);
    return res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    if (err.message === 'Farmer not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Failed to delete farmer', error: err.message });
  }
};

export const listFarmers = async (req, res) => {
  try {
    const result = await listFarmersService(req.query);
    return res.status(200).json({ success: true, data: result.docs, meta: result.meta });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to list farmers', error: err.message });
  }
};

export default {
  validateCreateFarmer,
  createFarmer,
  getFarmer,
  updateFarmer,
  deleteFarmer,
  listFarmers
};
