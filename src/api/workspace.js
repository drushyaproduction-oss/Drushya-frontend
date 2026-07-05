import axios from "axios";
import { config } from "../config";

const API_URL = `${config.apiUrl}/workspaces`;

const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
        headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
        }
    };
};

const getMultipartHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    };
};

export const fetchWorkspacesApi = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getWorkspaceByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createWorkspaceApi = async (formData) => {
    try {
        const response = await axios.post(API_URL, formData, getMultipartHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateWorkspaceApi = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, formData, getMultipartHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteWorkspaceApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error;
    }
};
