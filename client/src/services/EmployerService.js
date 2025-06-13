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

export const createCompanyPost = async (api, postData, mediaFiles) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content || '');
  formData.append('category', postData.category);
    
  // 添加媒体文件
  mediaFiles.forEach((file, index) => {
    formData.append(`media[${index}]`, file);
  });

  return api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getCompanyPosts = async (api) => {
  return api.get('/posts');
};

export const postJob = async (api, jobData) => {
  return api.post('/jobs', jobData);
};

// 添加获取职位列表方法
export const getJobPostings = async (api) => {
  return api.get('/jobs');
};

// 添加更新职位状态方法
export const updateJobStatus = async (api, jobId, newStatus) => {
  return api.put(`/jobs/${jobId}/status`, { status: newStatus });
};

export const deleteJob = async (api, jobId) => {
    return api.delete(`/jobs/${jobId}`);
};