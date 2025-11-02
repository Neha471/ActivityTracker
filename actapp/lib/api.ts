import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: 'https://6b71db88a3a2.ngrok-free.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

api.interceptors.request.use(
  async (config: any) => {
    const token = await SecureStore.getItemAsync('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.headers) {
      config.headers['X-Platform'] = Platform.OS;
    }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    if (!error.config) return Promise.reject(error);
    const originalRequest = error.config as { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await SecureStore.deleteItemAsync('authToken');
        
        if (error.config.url !== '/auth/login') {
          console.log('Session expired. Please log in again.');
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
    
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
