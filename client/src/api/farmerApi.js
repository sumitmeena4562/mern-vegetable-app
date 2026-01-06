import api from './axios';

/**
 * API Module: FarmerApi
 * Responsibility: Centralize all backend API calls related to Farmers.
 * Why: Keeps components clean, reuses logic, and makes URL management easier.
 */

// Base endpoint (Assuming backend routes are mounted at /farmers)
const TIMEOUT_MS = 10000; // Example: Set specific timeout for these calls if needed

// 1. Get List of Farmers
export const fetchFarmers = async ({ page = 1, limit = 20, q = '' } = {}) => {
    // Pass query params safely
    const response = await api.get('/farmers', {
        params: { page, limit, q },
        timeout: TIMEOUT_MS,
    });
    return response.data; // { success: true, data: [...], meta: {...} }
};

// 2. Get Single Farmer Details
export const fetchFarmerById = async (id) => {
    if (!id) throw new Error('Farmer ID is required');
    const response = await api.get(`/farmers/${id}`);
    return response.data;
};

// 3. Create a New Farmer
export const createFarmer = async (farmerData) => {
    // Future: Add basic client-side validation here before sending if needed
    const response = await api.post('/farmers', farmerData);
    return response.data;
};

// 4. Update Farmer Details
export const updateFarmer = async (id, updates) => {
    const response = await api.put(`/farmers/${id}`, updates);
    return response.data;
};

// 5. Delete Farmer
export const deleteFarmer = async (id) => {
    const response = await api.delete(`/farmers/${id}`);
    return response.data;
};

export default {
    fetchFarmers,
    fetchFarmerById,
    createFarmer,
    updateFarmer,
    deleteFarmer,
};
