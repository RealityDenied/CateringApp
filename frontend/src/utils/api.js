// src/utils/api.js
import axios from 'axios';

export const API = axios.create({
   //baseURL: 'http://localhost:3000/api', 
  baseURL: 'https://b967804c8612.ngrok-free.app/api',
});
