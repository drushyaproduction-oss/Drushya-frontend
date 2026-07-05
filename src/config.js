export const config = {

  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  backendUrl: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '')
};

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  return `${config.backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
