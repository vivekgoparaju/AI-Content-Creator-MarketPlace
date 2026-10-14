const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('creatorai_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.detail?.message || data?.detail || 'Request failed';
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

async function uploadFile(endpoint, formData) {
  const token = localStorage.getItem('creatorai_token');
  // Do NOT set Content-Type — browser sets it with the correct multipart boundary
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, { method: 'POST', headers, body: formData });
    const data = await response.json();
    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.detail?.message || data?.detail || 'Upload failed';
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    console.error(`Upload Error on [POST ${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Creators & Discovery
  searchCreators: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.set(key, String(val));
      }
    });
    const queryStr = searchParams.toString();
    return request(`/creators${queryStr ? `?${queryStr}` : ''}`);
  },
  getCreatorById: (id) => request(`/creators/${id}`),
  getMyProfile: () => request('/creators/me'),
  updateMyProfile: (payload) => request('/creators/me', { method: 'PUT', body: JSON.stringify(payload) }),
  getMyPortfolio: () => request('/creators/me/portfolio'),
  getSkills: () => request('/creators/skills'),
  getTools: () => request('/creators/tools'),

  // Portfolio
  createPortfolioItem: (payload) => request('/portfolio', { method: 'POST', body: JSON.stringify(payload) }),
  getPortfolioItem: (id) => request(`/portfolio/${id}`),
  updatePortfolioItem: (id, payload) => request(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePortfolioItem: (id) => request(`/portfolio/${id}`, { method: 'DELETE' }),

  // Portfolio Media Upload
  uploadPortfolioMedia: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadFile('/portfolio/upload-media', formData);
  },

  // Creative Briefs
  listBriefs: () => request('/briefs'),
  getBriefById: (id) => request(`/briefs/${id}`),
  createBrief: (payload) => request('/briefs', { method: 'POST', body: JSON.stringify(payload) }),
  updateBrief: (id, payload) => request(`/briefs/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteBrief: (id) => request(`/briefs/${id}`, { method: 'DELETE' }),

  // AI Brief Builder
  generateAIBrief: (payload) => request('/ai/brief-builder', { method: 'POST', body: JSON.stringify(payload) }),
};
