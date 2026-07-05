import { config } from '../config';

const API_URL = `${config.apiUrl}/subcategories`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAllServices = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
};

export const getTrendingServices = async () => {
    const response = await fetch(`${API_URL}/trending`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
};

export const getServicesByCategory = async (categoryId) => {
    const response = await fetch(`${API_URL}/category/${categoryId}`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
};

export const getServiceById = async (id) => {
    const response = await fetch(`${API_URL}/detail/${id}`);
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
};

export const createService = async (categoryId, formData) => {
    const response = await fetch(`${API_URL}/create-sub-category/${categoryId}`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders()
        },
        credentials: 'include',
        body: formData
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
};

export const updateService = async (id, formData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders()
            },
            credentials: 'include',
            body: formData
        });
        
        if (!response.ok) {
            const errText = await response.text();
            console.error("updateService failed:", response.status, errText);
            let parsedErr;
            try { parsedErr = JSON.parse(errText); } catch(e) { parsedErr = { message: errText }; }
            throw parsedErr;
        }
        
        return await response.json();
    } catch (error) {
        console.error("updateService exception:", error);
        throw error;
    }
};

export const deleteService = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders()
        },
        credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
};
