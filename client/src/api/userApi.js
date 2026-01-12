import api from './axios';

export const getFullProfile = async () => {
    // VITE_API_URL includes /auth, so we only need /profile
    const response = await api.get('/profile');
    return response.data;
}

// Forgot Password APIs
export const sendForgotPasswordOtp = async (identifier) => {
    const response = await api.post('/forgot-password-otp', { identifier });
    return response.data;
};

export const verifyResetOtp = async (identifier, otp) => {
    const response = await api.post('/verify-reset-otp', { identifier, otp });
    return response.data;
};

export const resetPasswordWithOtp = async (tempToken, newPassword) => {
    const response = await api.post('/reset-password-with-otp',
        { newPassword },
        { headers: { Authorization: `Bearer ${tempToken}` } }
    );
    return response.data;
};