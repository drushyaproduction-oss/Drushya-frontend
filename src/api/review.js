import { config } from '../config';

const API_URL = `${config.apiUrl}/reviews`;

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const createReview = async (formData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};

export const getReviewsByPackage = async (packageId) => {
    const response = await fetch(`${API_URL}/package/${packageId}`);
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};

export const getAllReviews = async () => {
    const response = await fetch(API_URL, {
        headers: {
            ...getAuthHeaders()
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};

export const updateReview = async (id, updateData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};

export const deleteReview = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders()
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};
