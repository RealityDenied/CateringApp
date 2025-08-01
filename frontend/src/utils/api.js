// src/utils/api.js
import axios from 'axios';

// Use environment variable for production, fallback to proxy for development
const baseURL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : '/api';

export const API = axios.create({
  baseURL: baseURL
});
