// client/src/services/EmployerService.js

// 获取企业资料
export const getCompanyProfile = async (api) => {
  return api.get('/employer/profile');
};

// 更新企业资料
export const updateCompanyProfile = async (api, profileData) => {
  return api.put('/employer/profile', profileData);
};

export const uploadProfileImage = async (api, file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadCoverImage = async (api, file) => {
  const formData = new FormData();
  formData.append("coverImage", file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
