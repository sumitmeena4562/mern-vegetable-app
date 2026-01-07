import api from './axios';

export const getFullProfile = async () => {
    // VITE_API_URL includes /auth, so we only need /profile
    const response = await api.get('/profile');
    return response.data;
}