import { config } from '../config';

const API_URL = `${config.apiUrl}/contacts`;

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const createContactApi = async (data) => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        if (!response.ok) throw resData;
        return resData;
    } catch (error) {
        throw error.message ? error : { message: "An error occurred while sending the message" };
    }
};

export const fetchContactsApi = async () => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: {
                ...getAuthHeaders()
            },
            credentials: 'include'
        });
        const resData = await response.json();
        if (!response.ok) throw resData;
        return resData;
    } catch (error) {
        throw error.message ? error : { message: "An error occurred while fetching contacts" };
    }
};

export const updateContactStatusApi = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        if (!response.ok) throw resData;
        return resData;
    } catch (error) {
        throw error.message ? error : { message: "An error occurred while updating the contact" };
    }
};

export const deleteContactApi = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeaders()
            },
            credentials: 'include'
        });
        const resData = await response.json();
        if (!response.ok) throw resData;
    return resData;
    } catch (error) {
        throw error.message ? error : { message: "An error occurred while deleting the contact" };
    }
};

export const sendContactEmailApi = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}/send-email`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders()
            },
            credentials: 'include'
        });
        const resData = await response.json();
        if (!response.ok) throw resData;
        return resData;
    } catch (error) {
        throw error.message ? error : { message: "An error occurred while sending the email" };
    }
};
