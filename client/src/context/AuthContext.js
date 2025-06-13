// src/context/AuthContext.js
import { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('access_token') !== null  );
  const [userType, setUserType] = useState(localStorage.getItem('userType') || null);

  const login = (accessToken, refreshToken, userType) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('userType', userType);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setIsLoggedIn(true);
    setUserType(userType);
  };

  // const revokeToken = async () => {
  //   try {
  //     const refreshToken = localStorage.getItem('refresh_token');
      
  //     const response = await axios.post('/api/auth/revoke', {
  //       refresh_token: refreshToken
  //     });
      
  //     return response.data.success;
  //   } catch (error) {
  //     console.error('Token revocation failed:', error);
  //     return false;
  //   }
  // };

  // const logout = async () => {
  //   try {
  //     // 先尝试撤销 token
  //     const revokeSuccess = await revokeToken();
  //     if (!revokeSuccess) {
  //       // 撤销失败，显示错误但不登出
  //       alert('Logout failed. Please try again.');
  //     } else {
  //       // 撤销成功，执行登出操作
  //       localStorage.removeItem('access_token');
  //       localStorage.removeItem('refresh_token');
  //       localStorage.removeItem('userType');
  //       delete axios.defaults.headers.common['Authorization'];
  //       setIsLoggedIn(false);
  //       setUserType(null);
  //       window.location.href = '/login';
  //     }
      
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //     alert('Logout failed. Please try again.');
  //   }
  // };

  const logout = async () => {
      try {
          // 先尝试撤销 token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
              try {
                  // 无论撤销是否成功，都继续登出
                  await axios.post('/api/auth/revoke', {
                      refresh_token: refreshToken
                  });
              } catch (error) {
                  console.log('Token revocation may have failed, but proceeding with logout');
              }
          }
          
          // 执行登出操作
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('userType');
          delete axios.defaults.headers.common['Authorization'];
          setIsLoggedIn(false);
          setUserType(null);
          window.location.href = '/login';
      } catch (error) {
          console.error('Logout failed:', error);
          // 即使出错也强制清除本地token
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('userType');
          delete axios.defaults.headers.common['Authorization'];
          setIsLoggedIn(false);
          setUserType(null);
          window.location.href = '/login';
      }
  };

  // 添加Token刷新函数
  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        logout();
        return null;
      }

      const response = await axios.post('/api/auth/refresh', {
        refresh_token: refreshTokenValue
      });
      
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); 
      return null;
    }
  }, [logout]);
  // const refreshToken = async () => {
  //   try {
  //     const refreshToken = localStorage.getItem('refresh_token');
  //     if (!refreshToken) {
  //       logout();
  //       return null;
  //     }

  //     const response = await axios.post('/api/auth/refresh', {
  //       refresh_token: refreshToken
  //     });
  //      console.log(response.data + response);
  //     const { access_token, refresh_token } = response.data;
  //     localStorage.setItem('access_token', access_token);
  //     localStorage.setItem('refresh_token', refresh_token);
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
  //     return access_token;
  //   } catch (error) {
  //     console.error('Token refresh failed:', error);
  //     logout(); 
  //     return null;
  //   }
  // };

  return (
    <AuthContext.Provider value={{isLoggedIn, userType, login, logout, refreshToken // 暴露刷新函数
    }}>
      {children}
    </AuthContext.Provider>
  );
};