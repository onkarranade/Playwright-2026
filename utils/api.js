export const API_BASE_URL = process.env.EVENTHUB_API_BASE_URL ?? 'https://api.eventhub.rahulshettyacademy.com/api';

export function apiUrl(path) {
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`;
}

export async function loginAsApiUser(request, credentials) {
  const response = await request.post(apiUrl('auth/login'), {
    data: credentials,
  });

  if (!response.ok()) {
    throw new Error(`API login failed with status ${response.status()}`);
  }

  const body = await response.json();

  if (!body?.token) {
    throw new Error('API login response did not include a token');
  }

  return body;
}

export function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}