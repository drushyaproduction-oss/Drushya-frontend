import axios from "axios";
import { config } from "../config";

const API_URL = `${config.apiUrl}/packages`;

// Helper to get token
const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
        headers: {
            'Authorization': adminToken ? `Bearer ${adminToken}` : ''
        }
    };
};

export const getAllPackages = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching packages:", error);
        throw error;
    }
};

export const getPackageBySubcategory = async (subcategoryId) => {
    try {
        const response = await axios.get(`${API_URL}/subcategory/${subcategoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching package by subcategory:", error);
        throw error;
    }
};

export const getPackagesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching packages by category:", error);
        throw error;
    }
};

export const getPackageById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching package:", error);
        throw error;
    }
};

export const createPackage = async (packageData) => {
    try {
        const response = await axios.post(API_URL, packageData, {
            ...getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error creating package:", error);
        throw error;
    }
};

export const updatePackage = async (id, packageData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, packageData, {
            ...getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error updating package:", error);
        throw error;
    }
};

export const deletePackage = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error deleting package:", error);
        throw error;
    }
};
