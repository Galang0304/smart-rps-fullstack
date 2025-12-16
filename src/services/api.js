import axios from 'axios';

// Use relative URL for production, absolute for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Hanya redirect ke login jika benar-benar unauthorized (401)
    // dan bukan karena endpoint tidak ada (404)
    if (error.response?.status === 401) {
      // Token expired atau tidak valid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// === AUTH APIs ===
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  refresh: () => apiClient.post('/auth/refresh'),
};

// === PROGRAM APIs ===
export const programAPI = {
  getAll: (params) => apiClient.get('/programs', { params }),
  getById: (id) => apiClient.get(`/programs/${id}`),
  create: (data) => apiClient.post('/programs', data),
  update: (id, data) => apiClient.put(`/programs/${id}`, data),
  delete: (id) => apiClient.delete(`/programs/${id}`),
};

// === PRODI APIs ===
export const prodiAPI = {
  getAll: (params) => apiClient.get('/prodis', { params }),
  getActive: () => apiClient.get('/prodis/active'),
  getById: (id) => apiClient.get(`/prodis/${id}`),
  create: (data) => apiClient.post('/prodis', data),
  update: (id, data) => apiClient.put(`/prodis/${id}`, data),
  delete: (id) => apiClient.delete(`/prodis/${id}`),
};

// === CPL APIs ===
export const cplAPI = {
  getAll: (params) => apiClient.get('/cpl', { params }),
  getById: (id) => apiClient.get(`/cpl/${id}`),
  getByProdiId: (prodiId) => apiClient.get(`/cpl/prodi/${prodiId}`),
  create: (data) => apiClient.post('/cpl', data),
  batchCreate: (data) => apiClient.post('/cpl/batch', data),
  update: (id, data) => apiClient.put(`/cpl/${id}`, data),
  delete: (id) => apiClient.delete(`/cpl/${id}`),
};

// === COURSE APIs ===
export const courseAPI = {
  getAll: (params) => apiClient.get('/courses', { params }),
  getById: (id) => apiClient.get(`/courses/${id}`),
  getByProgramId: (programId) => apiClient.get(`/courses/program/${programId}`),
  create: (data) => apiClient.post('/courses', data),
  update: (id, data) => apiClient.put(`/courses/${id}`, data),
  delete: (id) => apiClient.delete(`/courses/${id}`),
  importCSV: (programId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('program_id', programId);
    return apiClient.post('/courses/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// === TEMPLATE APIs ===
export const templateAPI = {
  getAll: () => apiClient.get('/templates'),
  getById: (id) => apiClient.get(`/templates/${id}`),
  getByProgramId: (programId) => apiClient.get(`/templates/program/${programId}`),
  getActiveByProgramId: (programId) => apiClient.get(`/templates/program/${programId}/active`),
  create: (data) => apiClient.post('/templates', data),
  update: (id, data) => apiClient.put(`/templates/${id}`, data),
  delete: (id) => apiClient.delete(`/templates/${id}`),
};

// === TEMPLATE VERSION APIs ===
export const templateVersionAPI = {
  create: (templateId, data) => apiClient.post(`/templates/${templateId}/versions`, data),
  getByTemplateId: (templateId) => apiClient.get(`/templates/${templateId}/versions`),
  getLatest: (templateId) => apiClient.get(`/templates/${templateId}/versions/latest`),
  getById: (id) => apiClient.get(`/template-versions/${id}`),
  update: (id, data) => apiClient.put(`/template-versions/${id}`, data),
  delete: (id) => apiClient.delete(`/template-versions/${id}`),
};

// === GENERATED RPS APIs ===
export const generatedRPSAPI = {
  getAll: (params) => apiClient.get('/generated', { params }),
  getById: (id) => apiClient.get(`/generated/${id}`),
  getByCourseId: (courseId) => apiClient.get(`/generated/course/${courseId}`),
  getByStatus: (status) => apiClient.get(`/generated/status/${status}`),
  create: (data) => apiClient.post('/generated', data),
  createSync: (data) => apiClient.post('/generate/sync', data),
  createDraft: (data) => apiClient.post('/generated/draft', data),
  update: (id, data) => apiClient.put(`/generated/${id}`, data),
  updateStatus: (id, status) => apiClient.patch(`/generated/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/generated/${id}`),
  export: (id) => apiClient.get(`/generated/${id}/export`),
};

// === AI HELPER APIs ===
export const aiHelperAPI = {
  healthCheck: () => apiClient.get('/ai/health'),
  getTypes: () => apiClient.get('/ai/types'),
  generateCourseDescription: (data) => apiClient.post('/ai/generate/description', data),
  generateCPMK: (data) => apiClient.post('/ai/generate/cpmk', data),
  generateSubCPMK: (data) => apiClient.post('/ai/generate/sub-cpmk', data),
  generateBahanKajian: (data) => apiClient.post('/ai/generate/bahan-kajian', data),
  generateRencanaPembelajaran: (data) => apiClient.post('/ai/generate/rencana-mingguan', data),
  generateTopik: (data) => apiClient.post('/ai/generate/topik', data),
  generateReferensi: (data) => apiClient.post('/ai/generate/referensi', data),
  regenerate: (data) => apiClient.post('/ai/regenerate', data),
};

// === EXPORT APIs ===
export const exportAPI = {
  getFormats: () => apiClient.get('/export/formats'),
  toPDF: (id) => apiClient.get(`/export/${id}/pdf`, { responseType: 'blob' }),
  toHTML: (id) => apiClient.get(`/export/${id}/html`),
  toHTMLPreview: (id) => apiClient.get(`/export/${id}/preview`),
};

// === USER APIs ===
export const userAPI = {
  getAll: (params) => apiClient.get('/users', { params }),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

export default apiClient;
