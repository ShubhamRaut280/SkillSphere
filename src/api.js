import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Register Error:', error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await api.post('/auth/login', loginData);
        return response.data;
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        throw error;
    }
};

export const createFreelanceProfile = async (profileData) => {
    try {
        const response = await api.post('/auth/freelanceProfile', profileData);
        return response.data;
    } catch (error) {
        console.error('Freelance Profile Error:', error.response?.data || error.message);
        throw error;
    }
};
