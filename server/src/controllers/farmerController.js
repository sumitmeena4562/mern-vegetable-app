import Farmer from '../models/Farmer.js';
import { body, validationResult } from 'express-validator';

export const validateCreateFarmer = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number is required')
];

export const createFarmer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { fullName, mobile, email, address, meta } = req.body;
    const existing = await Farmer.findOne({ mobile });
    if (existing) return res.status(400).json({ success: false, message: 'Mobile already registered' });

    const farmer = await Farmer.create({ fullName, mobile, email, address, meta });
    return res.status(201).json({ success: true, data: farmer });
  } catch (err) {
    console.error('createFarmer error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create farmer', error: err.message });
  }
};

export const getFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).lean();
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    return res.status(200).json({ success: true, data: farmer });
  } catch (err) {
    console.error('getFarmer error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch farmer', error: err.message });
  }
};

export const updateFarmer = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates._id;
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).lean();
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    return res.status(200).json({ success: true, message: 'Updated successfully', data: farmer });
  } catch (err) {
    console.error('updateFarmer error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update farmer', error: err.message });
  }
};

export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id).lean();
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    return res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error('deleteFarmer error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete farmer', error: err.message });
  }
};

export const listFarmers = async (req, res) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const filter = q ? { fullName: { $regex: q, $options: 'i' } } : {};
    const docs = await Farmer.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .lean();
    const total = await Farmer.countDocuments(filter);
    return res.status(200).json({ success: true, data: docs, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    console.error('listFarmers error:', err);
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