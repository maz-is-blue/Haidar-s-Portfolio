import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

const api = axios.create({
  baseURL: `${BASE}/api`,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password })
export const logout = () => api.post('/auth/logout')
export const getMe = () => api.get('/auth/me')

// Public endpoints (no auth required)
export const getSettings = () => api.get('/public/settings')
export const getWorkReports = () => api.get('/public/work-reports')
export const getCoverages = () => api.get('/public/coverages')
export const getExperiences = () => api.get('/public/experiences')
export const getPhotos = (cat) => api.get('/public/photos', { params: cat ? { cat } : {} })
export const getVideos = () => api.get('/public/videos')
export const getArticles = () => api.get('/public/articles')
export const getArticle = (id) => api.get(`/public/articles/${id}`)
export const getAbout = () => api.get('/public/about')
export const submitContact = (data) => api.post('/public/contact', data)

// Admin: Settings
export const adminGetSettings = () => api.get('/admin/settings')
export const adminUpdateSettings = (data) => api.put('/admin/settings', data)

// Admin: Work Reports
export const adminGetWorkReports = () => api.get('/admin/work-reports')
export const adminCreateWorkReport = (data) => api.post('/admin/work-reports', data)
export const adminUpdateWorkReport = (id, data) => api.put(`/admin/work-reports/${id}`, data)
export const adminDeleteWorkReport = (id) => api.delete(`/admin/work-reports/${id}`)

// Admin: Coverages
export const adminGetCoverages = () => api.get('/admin/coverages')
export const adminCreateCoverage = (data) => api.post('/admin/coverages', data)
export const adminUpdateCoverage = (id, data) => api.put(`/admin/coverages/${id}`, data)
export const adminDeleteCoverage = (id) => api.delete(`/admin/coverages/${id}`)

// Admin: Experiences
export const adminGetExperiences = () => api.get('/admin/experiences')
export const adminCreateExperience = (data) => api.post('/admin/experiences', data)
export const adminUpdateExperience = (id, data) => api.put(`/admin/experiences/${id}`, data)
export const adminDeleteExperience = (id) => api.delete(`/admin/experiences/${id}`)

// Admin: Photos
export const adminGetPhotos = () => api.get('/admin/photos')
export const adminCreatePhoto = (formData) =>
  api.post('/admin/photos', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdatePhoto = (id, formData) =>
  api.post(`/admin/photos/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeletePhoto = (id) => api.delete(`/admin/photos/${id}`)

// Admin: Videos
export const adminGetVideos = () => api.get('/admin/videos')
export const adminCreateVideo = (formData) =>
  api.post('/admin/videos', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateVideo = (id, formData) =>
  api.post(`/admin/videos/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteVideo = (id) => api.delete(`/admin/videos/${id}`)

// Admin: Articles
export const adminGetArticles = () => api.get('/admin/articles')
export const adminGetArticle = (id) => api.get(`/admin/articles/${id}`)
export const adminCreateArticle = (formData) =>
  api.post('/admin/articles', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateArticle = (id, formData) =>
  api.post(`/admin/articles/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteArticle = (id) => api.delete(`/admin/articles/${id}`)

// Admin: About
export const adminGetAbout = () => api.get('/admin/about')
export const adminUpdateAbout = (formData) =>
  api.post('/admin/about', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

// Admin: Certifications
export const adminGetCerts = () => api.get('/admin/certifications')
export const adminCreateCert = (data) => api.post('/admin/certifications', data)
export const adminUpdateCert = (id, data) => api.put(`/admin/certifications/${id}`, data)
export const adminDeleteCert = (id) => api.delete(`/admin/certifications/${id}`)

// Admin: Contact submissions
export const adminGetMessages = () => api.get('/admin/messages')
export const adminMarkRead = (id) => api.put(`/admin/messages/${id}/read`)
export const adminDeleteMessage = (id) => api.delete(`/admin/messages/${id}`)

export default api
