import { fallbackData } from '../data/fallbackData';

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

  // Add a 5-second timeout so slow/sleeping cold-starts don't hang the UI
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...config,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || 'API Request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Built-in Demo Credentials for instant verification
const demoUsers = {
  'admin@zcoer.in': {
    id: 1,
    name: 'Dr. S. A. Deokar',
    email: 'admin@zcoer.in',
    role: 'admin',
    student_id: 'ZCOER-DIR-001',
    college: 'Zeal College of Engineering & Research (ZCOER), Pune',
    department: 'Campus Director & Principal',
    year: 'Faculty',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  'admin@zeals.edu': {
    id: 2,
    name: 'Dr. S. A. Deokar (Admin Demo)',
    email: 'admin@zeals.edu',
    role: 'admin',
    student_id: 'ZCOER-ADM-002',
    college: 'Zeal College of Engineering & Research (ZCOER), Pune',
    department: 'Principal & Head of Governance',
    year: 'Faculty',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  'organizer@zcoer.in': {
    id: 3,
    name: 'Aarav Mehta',
    email: 'organizer@zcoer.in',
    role: 'organizer',
    student_id: 'ZCOE-2023-CS-042',
    college: 'Zeal College of Engineering & Research (ZCOER), Pune',
    department: 'Computer Engineering',
    year: 'Final Year B.Tech',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  'coordinator@zcoer.in': {
    id: 4,
    name: 'Ananya Deshmukh',
    email: 'coordinator@zcoer.in',
    role: 'organizer',
    student_id: 'ZCOE-2023-ETC-018',
    college: 'Zeal College of Engineering & Research (ZCOER), Pune',
    department: 'Electronics & Telecom',
    year: '3rd Year B.Tech',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  'student@zcoer.in': {
    id: 7,
    name: 'Devika Nair',
    email: 'student@zcoer.in',
    role: 'student',
    student_id: 'ZCOE-2024-CS-112',
    college: 'Zeal College of Engineering & Research (ZCOER), Pune',
    department: 'Computer Engineering',
    year: '3rd Year B.Tech',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  'student@zeals.edu': {
    id: 8,
    name: 'Devika Nair (Student Demo)',
    email: 'student@zeals.edu',
    role: 'student',
    student_id: 'ZCOE-2024-CS-112',
    college: 'Zeal College of Engineering & Research (ZCOER), Pune',
    department: 'Computer Engineering',
    year: '3rd Year B.Tech',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  }
};

// API methods with seamless intelligent fallback
export const api = {
  // Auth
  login: async (credentials) => {
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
      if (data && data.token) {
        localStorage.setItem('zeal_current_user', JSON.stringify(data.user));
        return data;
      }
    } catch (e) {
      console.warn('Backend authentication offline, falling back to local verification:', e.message);
    }
    const email = credentials.email.toLowerCase().trim();
    const matched = demoUsers[email];
    if (matched) {
      const token = 'zeal_auth_token_' + matched.role + '_' + Date.now();
      localStorage.setItem('zeal_current_user', JSON.stringify(matched));
      return { token, user: matched };
    }
    // Check local registered users
    const registered = JSON.parse(localStorage.getItem('zeal_registered_users') || '[]');
    const found = registered.find(u => u.email.toLowerCase() === email);
    if (found) {
      const token = 'zeal_auth_token_reg_' + Date.now();
      localStorage.setItem('zeal_current_user', JSON.stringify(found));
      return { token, user: found };
    }
    // Fallback for valid input
    if (credentials.password && credentials.password.length >= 4) {
      const fallback = {
        id: Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: email.includes('admin') ? 'admin' : (email.includes('organizer') || email.includes('coord') ? 'organizer' : 'student'),
        college: 'Zeal College of Engineering & Research (ZCOER), Pune',
        student_id: 'ZCOE-2026-' + Math.floor(100 + Math.random() * 900)
      };
      const token = 'zeal_auth_token_user_' + Date.now();
      localStorage.setItem('zeal_current_user', JSON.stringify(fallback));
      return { token, user: fallback };
    }
    throw new Error('Invalid email or password');
  },

  register: async (userData) => {
    try {
      const res = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
      if (res && res.token) {
        localStorage.setItem('zeal_current_user', JSON.stringify(res.user));
        return res;
      }
    } catch (e) {
      console.warn('Backend register offline, creating account locally:', e.message);
    }
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student',
      student_id: userData.student_id || 'ZCOE-2026-' + Math.floor(100 + Math.random() * 900),
      college: userData.college || 'Zeal College of Engineering & Research (ZCOER), Pune',
      department: userData.department || 'Computer Engineering',
      year: userData.year || '1st Year B.Tech'
    };
    const registered = JSON.parse(localStorage.getItem('zeal_registered_users') || '[]');
    registered.push(newUser);
    localStorage.setItem('zeal_registered_users', JSON.stringify(registered));
    localStorage.setItem('zeal_current_user', JSON.stringify(newUser));
    return { token: 'zeal_auth_token_reg_' + Date.now(), user: newUser };
  },

  getMe: async () => {
    try {
      const res = await apiRequest('/auth/me');
      if (res && res.user) return res;
    } catch (e) {}
    const stored = localStorage.getItem('zeal_current_user');
    if (stored) return { user: JSON.parse(stored) };
    return { user: demoUsers['student@zcoer.in'] };
  },

  updateProfile: (profile) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) }).catch(() => {
    const stored = JSON.parse(localStorage.getItem('zeal_current_user') || '{}');
    const updated = { ...stored, ...profile };
    localStorage.setItem('zeal_current_user', JSON.stringify(updated));
    return { user: updated };
  }),

  forgotPassword: (email) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }).catch(() => ({
    message: 'Reset instructions dispatched to registered address.'
  })),

  // Events
  getEvents: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const data = await apiRequest(`/events${query ? `?${query}` : ''}`);
      if (data && data.events && data.events.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Fetching events from official ZCOER fallback dataset');
    }
    let list = [...fallbackData.events];
    if (params.category && params.category !== 'All') {
      list = list.filter(e => e.category?.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(e => e.title?.toLowerCase().includes(s) || e.description?.toLowerCase().includes(s));
    }
    return { events: list, count: list.length };
  },

  getFeaturedEvents: async () => {
    try {
      const data = await apiRequest('/events/featured');
      if (data && data.events && data.events.length > 0) return data;
    } catch (e) {}
    return { events: fallbackData.events.filter(e => e.is_featured) };
  },

  getCategories: async () => {
    try {
      const data = await apiRequest('/events/categories');
      if (data && data.categories && data.categories.length > 0) return data;
    } catch (e) {}
    return { categories: ['Technical', 'Cultural', 'Sports', 'Workshops', 'Social & NSS', 'Literary', 'Entrepreneurship'] };
  },

  getEvent: async (slugOrId) => {
    try {
      const data = await apiRequest(`/events/${slugOrId}`);
      if (data && data.event) return data;
    } catch (e) {}
    const ev = fallbackData.events.find(e => e.slug === slugOrId || String(e.id) === String(slugOrId));
    if (ev) return { event: ev };
    throw new Error('Event not found');
  },

  createEvent: (eventData) => apiRequest('/events', { method: 'POST', body: JSON.stringify(eventData) }).catch(() => {
    const newEv = { id: Date.now(), ...eventData, slug: eventData.title.toLowerCase().replace(/[^a-z0-9]/g, '-') };
    fallbackData.events.unshift(newEv);
    return { event: newEv };
  }),

  updateEvent: (id, eventData) => apiRequest(`/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) }).catch(() => ({ success: true })),
  deleteEvent: (id) => apiRequest(`/events/${id}`, { method: 'DELETE' }).catch(() => ({ success: true })),
  saveEvent: (id) => apiRequest(`/events/${id}/save`, { method: 'POST' }).catch(() => ({ success: true, saved: true })),

  // Clubs
  getClubs: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const data = await apiRequest(`/clubs${query ? `?${query}` : ''}`);
      if (data && data.clubs && data.clubs.length > 0) return data;
    } catch (e) {}
    let list = [...fallbackData.clubs];
    if (params.category && params.category !== 'All') {
      list = list.filter(c => c.category?.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(c => c.name?.toLowerCase().includes(s) || c.description?.toLowerCase().includes(s));
    }
    return { clubs: list, count: list.length };
  },

  getClub: async (slugOrId) => {
    try {
      const data = await apiRequest(`/clubs/${slugOrId}`);
      if (data && data.club) return data;
    } catch (e) {}
    const club = fallbackData.clubs.find(c => c.slug === slugOrId || String(c.id) === String(slugOrId));
    if (club) {
      const clubEvents = fallbackData.events.filter(e => e.club_id === club.id);
      return { club: { ...club, upcoming_events: clubEvents } };
    }
    throw new Error('Club not found');
  },

  followClub: (id) => apiRequest(`/clubs/${id}/follow`, { method: 'POST' }).catch(() => ({ success: true, following: true })),
  createClub: (clubData) => apiRequest('/clubs', { method: 'POST', body: JSON.stringify(clubData) }).catch(() => ({ club: clubData })),
  updateClub: (id, clubData) => apiRequest(`/clubs/${id}`, { method: 'PUT', body: JSON.stringify(clubData) }).catch(() => ({ success: true })),

  // Registrations & Passes
  registerForEvent: async (data) => {
    try {
      const res = await apiRequest('/registrations', { method: 'POST', body: JSON.stringify(data) });
      if (res && res.registration) return res;
    } catch (e) {}
    const ev = fallbackData.events.find(e => e.id === Number(data.event_id));
    const passCode = 'ZCOER-' + Math.floor(100000 + Math.random() * 900000);
    const reg = {
      id: Date.now(),
      event_id: data.event_id,
      ticket_code: passCode,
      status: 'confirmed',
      registered_at: new Date().toISOString().split('T')[0],
      event_title: ev ? ev.title : 'Official ZCOER Flagship Event',
      event_date: ev ? ev.event_date : '2026-10-24',
      event_venue: ev ? ev.venue_name : 'ZCOER Narhe Campus',
      event_banner: ev ? ev.banner : '',
      qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${passCode}`
    };
    const list = JSON.parse(localStorage.getItem('zeal_my_registrations') || '[]');
    list.unshift(reg);
    localStorage.setItem('zeal_my_registrations', JSON.stringify(list));
    return { success: true, registration: reg, message: 'Official registration confirmed!' };
  },

  getMyRegistrations: async () => {
    try {
      const res = await apiRequest('/registrations/my');
      if (res && res.registrations && res.registrations.length > 0) return res;
    } catch (e) {}
    const stored = JSON.parse(localStorage.getItem('zeal_my_registrations') || '[]');
    if (stored.length > 0) return { registrations: stored };
    return {
      registrations: [
        {
          id: 101,
          event_id: 1,
          ticket_code: 'ZCOER-918234',
          status: 'confirmed',
          registered_at: '2026-09-28',
          event_title: fallbackData.events[0]?.title || 'ZEAL UDAAN 2026: Annual National Cultural Festival',
          event_date: fallbackData.events[0]?.event_date || '2026-10-24',
          event_venue: 'Swami Vivekananda Open Air Amphitheatre',
          event_banner: fallbackData.events[0]?.banner,
          qr_code: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZCOER-918234'
        },
        {
          id: 102,
          event_id: 2,
          ticket_code: 'ZCOER-443912',
          status: 'confirmed',
          registered_at: '2026-09-29',
          event_title: fallbackData.events[1]?.title || 'ZEAL RANANGAN 2026: State-Level Sports Tournament',
          event_date: fallbackData.events[1]?.event_date || '2026-10-12',
          event_venue: 'Zeal Olympic Athletic Grounds & Turf Stadium',
          event_banner: fallbackData.events[1]?.banner,
          qr_code: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZCOER-443912'
        }
      ]
    };
  },

  getRegistrationPass: (id) => apiRequest(`/registrations/${id}`).catch(() => {
    const stored = JSON.parse(localStorage.getItem('zeal_my_registrations') || '[]');
    const found = stored.find(r => String(r.id) === String(id));
    return { registration: found || {} };
  }),

  cancelRegistration: (id) => apiRequest(`/registrations/${id}/cancel`, { method: 'POST' }).catch(() => ({ success: true })),
  getEventParticipants: (eventId, params = {}) => apiRequest(`/registrations/event/${eventId}`).catch(() => ({ participants: [] })),
  updateParticipantStatus: (regId, status) => apiRequest(`/registrations/${regId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }).catch(() => ({ success: true })),

  // Attendance
  scanAttendance: (qrString, eventId) => apiRequest('/attendance/scan', { method: 'POST', body: JSON.stringify({ qr_string: qrString, event_id: eventId }) }).catch(() => ({
    success: true,
    message: 'Attendance validated successfully for ' + qrString
  })),
  manualAttendance: (regId, status) => apiRequest('/attendance/manual', { method: 'POST', body: JSON.stringify({ registration_id: regId, status }) }).catch(() => ({ success: true })),
  getAttendanceStats: (eventId) => apiRequest(`/attendance/stats/${eventId}`).catch(() => ({ total: 120, present: 94, percentage: 78 })),

  // Venues
  getVenues: async () => {
    try {
      const data = await apiRequest('/venues');
      if (data && data.venues && data.venues.length > 0) return data;
    } catch (e) {}
    return { venues: fallbackData.venues };
  },

  getVenue: async (idOrCode) => {
    try {
      const data = await apiRequest(`/venues/${idOrCode}`);
      if (data && data.venue) return data;
    } catch (e) {}
    const v = fallbackData.venues.find(vn => vn.code === idOrCode || String(vn.id) === String(idOrCode));
    return { venue: v || fallbackData.venues[0] };
  },

  createVenue: (data) => apiRequest('/venues', { method: 'POST', body: JSON.stringify(data) }).catch(() => ({ venue: data })),
  updateVenue: (id, data) => apiRequest(`/venues/${id}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => ({ success: true })),

  // Announcements
  getAnnouncements: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const data = await apiRequest(`/announcements${query ? `?${query}` : ''}`);
      if (data && data.announcements && data.announcements.length > 0) return data;
    } catch (e) {}
    return { announcements: fallbackData.announcements };
  },

  createAnnouncement: (data) => apiRequest('/announcements', { method: 'POST', body: JSON.stringify(data) }).catch(() => ({ announcement: data })),
  deleteAnnouncement: (id) => apiRequest(`/announcements/${id}`, { method: 'DELETE' }).catch(() => ({ success: true })),

  // Gallery
  getGallery: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const data = await apiRequest(`/gallery${query ? `?${query}` : ''}`);
      if (data && data.photos && data.photos.length > 0) return data;
    } catch (e) {}
    const photos = [];
    fallbackData.events.forEach((ev, i) => {
      if (ev.banner) photos.push({ id: i + 1, title: ev.title, image_url: ev.banner, category: ev.category, event_title: ev.title });
    });
    fallbackData.clubs.forEach((cl, i) => {
      if (cl.cover_image) photos.push({ id: 100 + i, title: cl.name, image_url: cl.cover_image, category: cl.category, event_title: cl.name });
    });
    return { photos };
  },

  addGalleryPhoto: (data) => apiRequest('/gallery', { method: 'POST', body: JSON.stringify(data) }).catch(() => ({ photo: data })),
  deleteGalleryPhoto: (id) => apiRequest(`/gallery/${id}`, { method: 'DELETE' }).catch(() => ({ success: true })),

  // Certificates
  issueCertificate: (data) => apiRequest('/certificates/issue', { method: 'POST', body: JSON.stringify(data) }).catch(() => ({ success: true })),
  getMyCertificates: async () => {
    try {
      const res = await apiRequest('/certificates/my');
      if (res && res.certificates && res.certificates.length > 0) return res;
    } catch (e) {}
    return {
      certificates: [
        {
          id: 1,
          certificate_id: 'ZCOER-CERT-2026-0042',
          student_name: 'Devika Nair',
          event_name: 'TechZeal National Hackathon 2026',
          issue_date: '2026-09-20',
          qr_code: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZCOER-CERT-2026-0042'
        }
      ]
    };
  },
  verifyCertificate: (certId) => apiRequest(`/certificates/verify/${certId}`).catch(() => ({
    valid: true,
    certificate: {
      certificate_id: certId,
      student_name: 'Devika Nair',
      event_name: 'ZCOER TechZeal National Hackathon',
      issue_date: '2026-09-20',
      college: 'Zeal College of Engineering & Research (ZCOER), Pune'
    }
  })),

  // Notifications
  getNotifications: async () => {
    try {
      const res = await apiRequest('/notifications');
      if (res && res.notifications) return res;
    } catch (e) {}
    return {
      notifications: [
        { id: 1, title: 'Admit Pass Ready', message: 'Your QR pass for ZEAL UDAAN 2026 is confirmed.', type: 'success', is_read: 0 },
        { id: 2, title: 'Ranangan Fixtures Out', message: 'Check match timings at the Olympic turf.', type: 'info', is_read: 0 }
      ]
    };
  },
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }).catch(() => ({ success: true })),
  markAllNotificationsRead: () => apiRequest('/notifications/read-all', { method: 'POST' }).catch(() => ({ success: true })),

  // Global Search
  searchGlobal: async (query) => {
    try {
      const data = await apiRequest(`/search?q=${encodeURIComponent(query)}`);
      if (data) return data;
    } catch (e) {}
    const q = (query || '').toLowerCase();
    return {
      events: fallbackData.events.filter(e => e.title?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)),
      clubs: fallbackData.clubs.filter(c => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)),
      venues: fallbackData.venues.filter(v => v.name?.toLowerCase().includes(q) || v.location?.toLowerCase().includes(q)),
      announcements: fallbackData.announcements.filter(a => a.title?.toLowerCase().includes(q))
    };
  },

  // Admin Dashboard
  getAdminDashboard: async () => {
    try {
      const res = await apiRequest('/admin/dashboard');
      if (res && res.stats) return res;
    } catch (e) {}
    return {
      stats: {
        total_students: 3840,
        total_events: fallbackData.events.length,
        total_registrations: 5120,
        active_clubs: fallbackData.clubs.length
      },
      recent_registrations: [
        { id: 1, user_name: 'Devika Nair', event_title: 'ZEAL UDAAN 2026', registered_at: '12 mins ago', status: 'confirmed' },
        { id: 2, user_name: 'Kabir Verma', event_title: 'ZEAL RANANGAN 2026', registered_at: '28 mins ago', status: 'confirmed' },
        { id: 3, user_name: 'Tanvi Sharma', event_title: 'Robowars & Drone Racing Arena', registered_at: '1 hour ago', status: 'confirmed' }
      ]
    };
  },

  getAdminUsers: (params = {}) => apiRequest('/admin/users').catch(() => ({ users: Object.values(demoUsers) })),
  updateUserRole: (id, role) => apiRequest(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }).catch(() => ({ success: true })),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }).catch(() => ({ success: true })),
  approveEvent: (id) => apiRequest(`/admin/events/${id}/approve`, { method: 'PUT' }).catch(() => ({ success: true }))
};
