const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return { status: res.status, data };
}

export function signup({ name, email, password }) {
  return request('/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

export async function login({ email, password }) {
  return request('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function getUser(email) {
  return request(`/user?email=${encodeURIComponent(email)}`, { method: 'GET' });
}

export async function updateUser({ email, name }) {
  return request('/user', { method: 'PATCH', body: JSON.stringify({ email, name }) });
}