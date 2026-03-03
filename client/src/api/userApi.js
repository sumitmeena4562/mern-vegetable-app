import api from './axios';

export const getFullProfile = async () => {
    // VITE_API_URL includes /auth, so we only need /profile
    const response = await api.get('/auth/profile');
    return response.data;
}

// Forgot Password APIs
export const sendForgotPasswordOtp = async (identifier) => {
    const response = await api.post('/auth/forgot-password-otp', { identifier });
    return response.data;
};

export const verifyResetOtp = async (identifier, otp) => {
    const response = await api.post('/auth/verify-reset-otp', { identifier, otp });
    return response.data;
};

export const resetPasswordWithOtp = async (tempToken, newPassword) => {
    const response = await api.post('/auth/reset-password-with-otp',
        { newPassword },
        { headers: { Authorization: `Bearer ${tempToken}` } }
    );
    return response.data;
};

// Farmer Dashboard Stats
export const getFarmerStats = async () => {
    const response = await api.get('/farmers/stats');
    return response.data;
};

// Wallet & Finance APIs
export const getWalletStats = async () => {
    const response = await api.get('/farmers/wallet/stats');
    return response.data;
};

export const getTransactionHistory = async () => {
    const response = await api.get('/farmers/wallet/transactions');
    return response.data;
};

export const requestWithdrawal = async (withdrawalData) => {
    const response = await api.post('/farmers/wallet/withdraw', withdrawalData);
    return response.data;
};

// Order Management APIs
export const getFarmerOrders = async (status = 'all') => {
    const response = await api.get(`/farmers/orders?status=${status}`);
    return response.data;
};

export const getOrderDetails = async (orderId) => {
    const response = await api.get(`/farmers/orders/${orderId}`);
    return response.data;
};

export const updateOrderStatus = async (orderId, statusData) => {
    const response = await api.put(`/farmers/orders/${orderId}/status`, statusData);
    return response.data;
};

// Product Management APIs
export const getFarmerProducts = async (status = 'all', page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({ status, page, limit });
    if (search) params.append('search', search);
    const response = await api.get(`/farmers/products?${params.toString()}`);
    return response.data;
};

export const updateProductStatus = async (productId, status) => {
    const response = await api.put(`/farmers/products/${productId}/status`, { status });
    return response.data;
};

export const deleteProduct = async (productId) => {
    const response = await api.delete(`/farmers/products/${productId}`);
    return response.data;
};

export const updateProduct = async (productId, productData) => {
    const response = await api.put(`/farmers/products/${productId}`, productData);
    return response.data;
};

// Profile Management APIs
export const getFarmerProfile = async () => {
    const response = await api.get('/farmers/profile');
    return response.data;
};

export const updateFarmerProfile = async (profileData) => {
    const response = await api.put('/farmers/profile', profileData);
    return response.data;
};

export const updateBankDetails = async (bankData) => {
    const response = await api.put('/farmers/profile', { bankDetails: bankData });
    return response.data;
};

