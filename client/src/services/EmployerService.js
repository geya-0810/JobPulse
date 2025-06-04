// client/src/services/EmployerService.js
import axios from 'axios';

// 创建带配置的 Axios 实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 10000,
});

// 请求拦截器：自动添加 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一处理错误
api.interceptors.response.use(
  response => response.data.data, // 直接返回数据部分
  error => {
    if (error.response) {
      // 处理 HTTP 错误状态
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// 获取企业资料
export const getCompanyProfile = async () => {
  return api.get('/employer/profile');
};

// 更新企业资料
export const updateCompanyProfile = async (profileData) => {
  return api.put('/employer/profile', profileData);
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadCoverImage = async (file) => {
  const formData = new FormData();
  formData.append("coverImage", file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// // 获取企业资料
// export const getCompanyProfile = async (token) => {
//   try {
//     const response = await axios.get('/api/employer/profile', {
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       withCredentials: true
//     });
//     console.log('Profile response:', response);
//     return response.data.data;
//   } catch (error) {
//     console.error('Error fetching company profile:', error.response);
//     throw error;
//   }
// };

// // 更新企业资料
// export const updateCompanyProfile = async (profileData) => {
//   try {
//     const response = await axios.put(
//       '/api/employer/profile',
//       profileData,
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error updating company profile:', error);
//     throw error;
//   }
// };



// EmployerService.js
// export const getCompanyProfile = async (token) => {
//   try {
//     const response = await fetch('/api/employer/profile', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include'
//     });
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return data.data;
//   } catch (error) {
//     console.error('Error fetching company profile:', error);
//     throw error;
//   }
// };

// export const updateCompanyProfile = async (profileData) => {
//   try {
//     const response = await fetch('/api/employer/profile', {
//       method: 'PUT',

//       body: JSON.stringify(profileData),
//       credentials: 'include'
//     });
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
//     console.log('Profile response:', data);
//     console.log('Profile response:', data.data);
//     return data.data;
//   } catch (error) {
//     console.error('Error updating company profile:', error);
//     throw error;
//   }
// };
