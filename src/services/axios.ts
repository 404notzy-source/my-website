import axios from 'axios'

const API_BASE = import.meta.env.DEV ? '' : ''

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

let getAccessToken: () => string | null = () => null
let onRefreshFailed: () => void = () => {}

export function configureAxios(
  tokenGetter: () => string | null,
  refreshFailedHandler: () => void
) {
  getAccessToken = tokenGetter
  onRefreshFailed = refreshFailedHandler
}

apiClient.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) throw new Error('No refresh token')

        const res = await axios.post('/api/auth/refresh', {
          refresh_token: refreshToken,
        })

        const newToken = res.data.access_token
        localStorage.setItem('access_token_temp', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch {
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('access_token_temp')
        onRefreshFailed()
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
