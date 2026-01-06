import Farmer from '../models/Farmer.js';

/**
 * Service: FarmerService
 * Responsibility: Handle all direct database operations and business logic for Farmers.
 * Why: Keeping logic here makes the Controller clean and easier to test.
 */

// Create a new Farmer
export const createFarmerService = async (data) => {
    // Check for duplication logic here instead of controller
    const existing = await Farmer.findOne({ mobile: data.mobile });
    if (existing) {
        throw new Error('Mobile already registered');
    }

    // Create and return the farmer
    const farmer = await Farmer.create(data);
    return farmer;
};

// Get Farmer by ID
export const getFarmerService = async (id) => {
    const farmer = await Farmer.findById(id).lean();
    if (!farmer) {
        throw new Error('Farmer not found');
    }
    return farmer;
};

// Update Farmer
export const updateFarmerService = async (id, updates) => {
    // Prevent updating ID
    delete updates._id;

    const farmer = await Farmer.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    }).lean();

    if (!farmer) {
        throw new Error('Farmer not found');
    }
    return farmer;
};

// Delete Farmer
export const deleteFarmerService = async (id) => {
    const farmer = await Farmer.findByIdAndDelete(id).lean();
    if (!farmer) {
        throw new Error('Farmer not found');
    }
    return true;
};

// List Farmers with Pagination & Filtering
export const listFarmersService = async ({ page = 1, limit = 20, q }) => {
    const filter = q ? { fullName: { $regex: q, $options: 'i' } } : {};

    // Future Enhancement: Add sorting logic here (e.g., sort by createdAt desc)

    const docs = await Farmer.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit, 10))
        .lean();

    const total = await Farmer.countDocuments(filter);

    return {
        docs,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit)
        }
    };
};

export default {
    createFarmerService,
    getFarmerService,
    updateFarmerService,
    deleteFarmerService,
    listFarmersService
};
