// src/services/keralaSSLCService.js
import api from './api';

export const keralaSSLCService = {
  // Public / In-App individual search
  searchIndividualResult: async (registerNumber, dob = null, academicYear = '2025-2026') => {
    const params = { registerNumber, academicYear };
    if (dob) params.dob = dob;
    const response = await api.get('/sslc/search', { params });
    return response.data;
  },

  // School-wide analytics and Full A+ toppers
  getSchoolSSLCAnalytics: async (academicYear = '2025-2026') => {
    const response = await api.get('/sslc/analytics', { params: { academicYear } });
    return response.data;
  },

  // Paginated and filterable results register
  getAllSchoolResults: async (params = {}) => {
    const response = await api.get('/sslc/results', { params });
    return response.data;
  },

  // Bulk import SSLC results from parsed file
  bulkImportSSLCResults: async (data) => {
    const response = await api.post('/sslc/bulk-import', data);
    return response.data;
  },

  // 1-Click Demo sample data seed
  seedSampleSSLCResults: async (academicYear = '2025-2026') => {
    const response = await api.post('/sslc/seed-sample', { academicYear });
    return response.data;
  },

  // Broadcast SSLC results to parents
  broadcastSSLCToParents: async (academicYear = '2025-2026') => {
    const response = await api.post('/sslc/broadcast', { academicYear });
    return response.data;
  }
};

export default keralaSSLCService;
