import { useState, useEffect, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getCaptcha } from '../services/auth'

export default function LoginPage() {
  const { state, login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaId, setCaptchaId] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const refreshCaptcha = async () => {
    try {
      const data = await getCaptcha()
      setCaptchaId(data.captcha_id)
      setCaptchaImage(data.image)
      setCaptchaAnswer('')
    } catch {
      setError('获取验证码失败')
    }
  }

  useEffect(() => { refreshCaptcha() }, [])

  if (state.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码')
      return
    }
    if (!captchaAnswer.trim()) {
      setError('请输入验证码')
      return
    }

    setSubmitting(true)
    try {
      await login(username.trim(), password, captchaId, captchaAnswer.trim())
      navigate('/')
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      if (detail === 'Invalid or expired captcha') {
        setError('验证码错误或已过期')
        refreshCaptcha()
      } else {
        setError(detail || '用户名或密码错误')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center px-4 pt-16 transition-colors duration-700">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">登录</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">用户名</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              autoFocus autoComplete="username" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              autoComplete="current-password" />
          </div>

          {/* 验证码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">验证码</label>
            <div className="flex gap-2 items-stretch">
              {captchaImage && (
                <img
                  src={captchaImage}
                  alt="验证码"
                  className="h-10 rounded border border-slate-200 dark:border-gray-600 cursor-pointer shrink-0"
                  onClick={refreshCaptcha}
                  title="点击刷新"
                />
              )}
              <input id="captcha" type="text" value={captchaAnswer} onChange={e => setCaptchaAnswer(e.target.value)}
                placeholder="请输入验证码"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-sm"
                autoComplete="off" />
              <button type="button" onClick={refreshCaptcha}
                className="shrink-0 px-2 text-blue-500 hover:text-blue-600 transition-colors" title="换一张">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors">
            {submitting ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          还没有账号？<Link to="/register" className="ml-1 text-blue-500 hover:text-blue-600 font-medium transition-colors">注册</Link>
        </p>
      </div>
    </div>
  )
}
