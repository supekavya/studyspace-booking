import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (data) => api.post('/auth/register', data),
}

// ── Rooms ─────────────────────────────────────────────────────────────────────
export const roomApi = {
  getAll: (params) => api.get('/rooms', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  getAvailable: (date, startTime, endTime) => api.get('/rooms/available', { params: { date, startTime, endTime } }),
  getSlots: (id, date) => api.get(`/rooms/${id}/slots`, { params: { date } }),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingApi = {
  create: (data) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getToday: () => api.get('/bookings/today'),
  getAll: (date) => api.get('/bookings/all', { params: date ? { date } : {} }),
  cancel: (id) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats'),
}

export default api
