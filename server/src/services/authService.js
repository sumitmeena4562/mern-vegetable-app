import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Aapka backend URL

export const registerFarmer = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register/farmer`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Server connection failed";
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Invalid credentials";
    }
};

