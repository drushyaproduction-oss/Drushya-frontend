import { config } from '../config';

const API_URL = `${config.apiUrl}/bookings`;

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const createBookingRequest = async (formData) => {
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

export const getAllBookingRequests = async () => {
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

export const updateBookingRequest = async (id, updateData) => {
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

export const deleteBookingRequest = async (id) => {
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

export const sendBookingEmailApi = async (id) => {
    const response = await fetch(`${API_URL}/${id}/send-email`, {
        method: 'POST',
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
