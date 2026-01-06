import mongoose from 'mongoose';
import User from '../models/User.js';
import Farmer from '../models/Farmer.js';


/**
 * Service: FarmerService
 * Responsibility: Handle all direct database operations and business logic for Farmers.
 * Why: Keeping logic here makes the Controller clean and easier to test.
 */

// Create a new Farmer
export const createFarmerService = async (data) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Check if User already exists (Mobile or Email)
        const existingUser = await User.findOne({
            $or: [{ mobile: data.mobile }, { email: data.email }]
        }).session(session);

        if (existingUser) {
            throw new Error('User with this mobile or email already exists');
        }

        // 2. Create the User Login Account first
        const userPayload = {
            fullName: data.fullName,
            mobile: data.mobile,
            email: data.email,
            password: data.password,
            role: 'farmer',
            address: data.address,
            location: data.location
        };

        // Create User (Password hashing happens in User model pre-save hook)
        const newUser = new User(userPayload);
        await newUser.save({ session });

        // 3. Create the Farmer Profile linked to the User
        const farmerPayload = {
            user: newUser._id,
            farmName: data.farmName || `${data.fullName}'s Farm`,
            farmSize: data.farmSize || 1,
            farmSizeUnit: data.farmSizeUnit || 'acre',
            location: data.location,
            crops: data.crops || [],
            preferredPickupTime: data.preferredPickupTime
        };

        const newFarmer = new Farmer(farmerPayload);
        await newFarmer.save({ session });

        await session.commitTransaction();
        session.endSession();



        return { user: newUser, farmer: newFarmer };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
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
