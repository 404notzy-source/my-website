import apiClient from './axios'

export interface User {
  id: number
  username: string
  email: string
  avatar_url: string | null
  level: number
  browse_count: number
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface BrowseHistoryItem {
  product_id: string
  viewed_at: string
}

export interface HistoryResponse {
  items: BrowseHistoryItem[]
  total: number
  page: number
  page_size: number
}

export async function getCaptcha(): Promise<{ captcha_id: string; image: string }> {
  const res = await apiClient.get('/api/auth/captcha')
  return res.data
}

export async function register(
  username: string,
  email: string,
  password: string,
  captchaId: string,
  captchaAnswer: string
): Promise<TokenResponse> {
  const res = await apiClient.post('/api/auth/register', {
    username, email, password,
    captcha_id: captchaId,
    captcha_answer: captchaAnswer,
  })
  return res.data
}

export async function login(
  username: string,
  password: string,
  captchaId: string,
  captchaAnswer: string
): Promise<TokenResponse> {
  const res = await apiClient.post('/api/auth/login', {
    username, password,
    captcha_id: captchaId,
    captcha_answer: captchaAnswer,
  })
  return res.data
}

export async function refreshToken(token: string): Promise<{ access_token: string }> {
  const res = await apiClient.post('/api/auth/refresh', { refresh_token: token })
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get('/api/users/me')
  return res.data
}

export async function updateProfile(data: { avatar_url?: string }): Promise<User> {
  const res = await apiClient.patch('/api/users/me', data)
  return res.data
}

export async function uploadAvatar(file: File): Promise<User> {
  const form = new FormData()
  form.append('file', file)
  const res = await apiClient.post('/api/users/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function recordView(productId: string): Promise<void> {
  await apiClient.post(`/api/products/${productId}/view`)
}

export async function getHistory(
  page = 1,
  pageSize = 20
): Promise<HistoryResponse> {
  const res = await apiClient.get('/api/users/me/history', {
    params: { page, pageSize },
  })
  return res.data
}
