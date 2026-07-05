import { config } from '../config';

export const sendOtpApi = async (email) => {
  const response = await fetch(`${config.apiUrl}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  return { response, data };
};

export const verifyOtpApi = async (email, otp) => {
  const response = await fetch(`${config.apiUrl}/admin/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await response.json();
  return { response, data };
};
