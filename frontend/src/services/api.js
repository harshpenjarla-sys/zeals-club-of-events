const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getAuthToken() {
  return localStorage.getItem('zeal_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('zeal_token', token);
  } else {
    localStorage.removeItem('zeal_token');
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'API Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// API methods
export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (profile) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // Events
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/events${query ? `?${query}` : ''}`);
  },
  getFeaturedEvents: () => apiRequest('/events/featured'),
  getCategories: () => apiRequest('/events/categories'),
  getEvent: (slugOrId) => apiRequest(`/events/${slugOrId}`),
  createEvent: (eventData) => apiRequest('/events', { method: 'POST', body: JSON.stringify(eventData) }),
  updateEvent: (id, eventData) => apiRequest(`/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) }),
  deleteEvent: (id) => apiRequest(`/events/${id}`, { method: 'DELETE' }),
  saveEvent: (id) => apiRequest(`/events/${id}/save`, { method: 'POST' }),

  // Clubs
  getClubs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/clubs${query ? `?${query}` : ''}`);
  },
  getClub: (slugOrId) => apiRequest(`/clubs/${slugOrId}`),
  followClub: (id) => apiRequest(`/clubs/${id}/follow`, { method: 'POST' }),
  createClub: (clubData) => apiRequest('/clubs', { method: 'POST', body: JSON.stringify(clubData) }),
  updateClub: (id, clubData) => apiRequest(`/clubs/${id}`, { method: 'PUT', body: JSON.stringify(clubData) }),

  // Registrations
  registerForEvent: (data) => apiRequest('/registrations', { method: 'POST', body: JSON.stringify(data) }),
  getMyRegistrations: () => apiRequest('/registrations/my'),
  getRegistrationPass: (id) => apiRequest(`/registrations/${id}`),
  cancelRegistration: (id) => apiRequest(`/registrations/${id}/cancel`, { method: 'POST' }),
  getEventParticipants: (eventId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/registrations/event/${eventId}${query ? `?${query}` : ''}`);
  },
  updateParticipantStatus: (regId, status) => apiRequest(`/registrations/${regId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Attendance
  scanAttendance: (qrString, eventId) => apiRequest('/attendance/scan', { method: 'POST', body: JSON.stringify({ qr_string: qrString, event_id: eventId }) }),
  manualAttendance: (regId, status) => apiRequest('/attendance/manual', { method: 'POST', body: JSON.stringify({ registration_id: regId, status }) }),
  getAttendanceStats: (eventId) => apiRequest(`/attendance/stats/${eventId}`),

  // Venues
  getVenues: () => apiRequest('/venues'),
  getVenue: (idOrCode) => apiRequest(`/venues/${idOrCode}`),
  createVenue: (data) => apiRequest('/venues', { method: 'POST', body: JSON.stringify(data) }),
  updateVenue: (id, data) => apiRequest(`/venues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Announcements
  getAnnouncements: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/announcements${query ? `?${query}` : ''}`);
  },
  createAnnouncement: (data) => apiRequest('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => apiRequest(`/announcements/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/gallery${query ? `?${query}` : ''}`);
  },
  addGalleryPhoto: (data) => apiRequest('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  deleteGalleryPhoto: (id) => apiRequest(`/gallery/${id}`, { method: 'DELETE' }),

  // Certificates
  issueCertificate: (data) => apiRequest('/certificates/issue', { method: 'POST', body: JSON.stringify(data) }),
  getMyCertificates: () => apiRequest('/certificates/my'),
  verifyCertificate: (certId) => apiRequest(`/certificates/verify/${certId}`),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => apiRequest('/notifications/read-all', { method: 'POST' }),

  // Search
  searchGlobal: (query) => apiRequest(`/search?q=${encodeURIComponent(query)}`),

  // Admin
  getAdminDashboard: () => apiRequest('/admin/dashboard'),
  getAdminUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${query ? `?${query}` : ''}`);
  },
  updateUserRole: (id, role) => apiRequest(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
  approveEvent: (id) => apiRequest(`/admin/events/${id}/approve`, { method: 'PUT' })
};
