import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

let token = null

export const setToken = (newToken) => {
  token = newToken
}

const client = axios.create({
  baseURL: API_BASE
})

client.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (username, password) => {
  const { data } = await client.post('/auth/login', { username, password })
  setToken(data.access_token)
  return data
}

export const fetchCourses = async () => {
  const { data } = await client.get('/courses')
  return data.courses
}

export const fetchCourseSummary = async (courseId) => {
  const { data } = await client.get(`/courses/${courseId}/summary`)
  return data
}

export const fetchCourseStudents = async (courseId) => {
  const { data } = await client.get(`/courses/${courseId}/students`)
  return data.students
}

export const fetchCoursePaths = async (courseId) => {
  const { data } = await client.get(`/courses/${courseId}/paths`)
  return data
}

export const fetchAdminOverview = async () => {
  const { data } = await client.get('/admin/overview')
  return data
}

export const fetchSystemHealth = async () => {
  const { data } = await client.get('/system/health')
  return data
}

export const fetchSystemJobs = async () => {
  const { data } = await client.get('/system/jobs')
  return data.jobs
}

export const fetchSystemLogs = async () => {
  const { data } = await client.get('/system/logs')
  return data.logs
}
