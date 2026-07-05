import { config } from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchBannersApi = async (type = '') => {
  const url = type ? `${config.apiUrl}/banners?type=${type}` : `${config.apiUrl}/banners`;
  const response = await fetch(url);
  const data = await response.json();
  return { response, data };
};

export const createBannerApi = async (formData) => {
  const response = await fetch(`${config.apiUrl}/banners`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders()
    },
    credentials: 'include',
    body: formData
  });
  const data = await response.json();
  return { response, data };
};

export const updateBannerApi = async (id, formData) => {
  const response = await fetch(`${config.apiUrl}/banners/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders()
    },
    credentials: 'include',
    body: formData
  });
  const data = await response.json();
  return { response, data };
};

export const deleteBannerApi = async (id) => {
  const response = await fetch(`${config.apiUrl}/banners/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    },
    credentials: 'include'
  });
  const data = await response.json();
  return { response, data };
};
