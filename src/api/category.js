import { config } from '../config';

const API_URL = `${config.apiUrl}/categories`;

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAllCategories = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};

export const getCategoryBySlug = async (slug) => {
    const response = await fetch(`${API_URL}/s/${slug}`);
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};

export const createCategory = async (formData) => {
    const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders()
        },
        credentials: 'include',
        body: formData
    });
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};

export const updateCategory = async (id, formData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeaders()
        },
        credentials: 'include',
        body: formData
    });
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};

export const deleteCategory = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders()
        },
        credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
        throw data;
    }
    return data;
};
