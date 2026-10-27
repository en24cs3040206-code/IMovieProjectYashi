import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('imovies_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired
      const token = localStorage.getItem('imovies_token');
      if (token && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('imovies_token');
        localStorage.removeItem('imovies_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Movie Services
export const movieService = {
  getAll: (params) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  create: (data) => api.post('/movies', data),
  update: (id, data) => api.put(`/movies/${id}`, data),
  delete: (id) => api.delete(`/movies/${id}`),
};

// Theatre Services
export const theatreService = {
  getAll: (params) => api.get('/theatres', { params }),
  getById: (id) => api.get(`/theatres/${id}`),
  create: (data) => api.post('/theatres', data),
  update: (id, data) => api.put(`/theatres/${id}`, data),
  delete: (id) => api.delete(`/theatres/${id}`),
};

// Show Services
export const showService = {
  getAll: (params) => api.get('/shows', { params }),
  getByMovie: (movieId, params) => api.get(`/shows/movie/${movieId}`, { params }),
  getById: (id) => api.get(`/shows/${id}`),
  create: (data) => api.post('/shows', data),
  update: (id, data) => api.put(`/shows/${id}`, data),
  delete: (id) => api.delete(`/shows/${id}`),
};

// Booking Services
export const bookingService = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  getAllAdmin: (params) => api.get('/bookings/admin/all', { params }),
};

// Notification Services
export const notificationService = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export default api;
