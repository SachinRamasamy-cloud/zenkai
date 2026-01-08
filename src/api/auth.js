// src/api/auth.js

const API_URL = 'http://localhost:5000/api/users';

// --- REGISTER ---
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

// --- LOGIN ---
export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const getMe = async (token) => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
  return data;
};
export const toggleList = async (token, listType, animeId) => {
  const response = await fetch(`${API_URL}/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      listType: listType, // 'watchlist', 'favorites', or 'bookmarks'
      animeId: animeId
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update list');
  return data;
};