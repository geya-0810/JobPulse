// src/services/Api.js
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useContext, useMemo } from 'react';

// 创建基础 API 实例
const createApi = () => {
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
    withCredentials: true,
    timeout: 10000,
  });

  // 请求拦截器：添加 token
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

// 创建带刷新逻辑的 API 实例
export const useApi = () => {
  const { refreshToken } = useContext(AuthContext);
  
  // 使用useMemo缓存api实例
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
      withCredentials: true,
      timeout: 10000,
    });

    // 请求拦截器
    instance.interceptors.request.use(config => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 响应拦截器
    instance.interceptors.response.use(
      response => response.data,
      async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return instance(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    
    return instance;
  }, [refreshToken]); // 仅当refreshToken变化时重新创建

  return api;
};
