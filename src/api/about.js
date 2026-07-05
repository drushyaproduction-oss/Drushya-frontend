import axios from 'axios';
import { config } from '../config';

const getAuthHeaders = () => {
  const adminToken = localStorage.getItem('adminToken');
  return {
    headers: {
      Authorization: adminToken ? `Bearer ${adminToken}` : ''
    }
  };
};

export const fetchAboutProfileApi = async () => {
  return await axios.get(`${config.apiUrl}/about`);
};

export const saveAboutProfileApi = async (formData) => {
  return await axios.post(`${config.apiUrl}/about`, formData, getAuthHeaders());
};

export const deleteAboutProfileApi = async () => {
  return await axios.delete(`${config.apiUrl}/about`, getAuthHeaders());
};
