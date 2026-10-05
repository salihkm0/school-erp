import api from './api';

const schoolProfileService = {
  getProfile: async () => {
    const response = await api.get('/app-config/school-profile');
    return response.data?.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/app-config/school-profile', profileData);
    return response.data?.data;
  },

  uploadBranding: async (formData) => {
    const response = await api.post('/app-config/upload-branding', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data;
  },
};

export default schoolProfileService;
