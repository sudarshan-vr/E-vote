// src/utils/api.js
import axios from 'axios';

// Base URL for API calls.
// In production (Vercel), set REACT_APP_API_BASE_URL in project env.
// In development, this falls back to localhost:5000 (your Express server).
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
