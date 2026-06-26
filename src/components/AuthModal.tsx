import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getCaptcha } from '../services/auth'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AuthModal({ open, onClose }: Props) {
  const { login, register } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captchaId, setCaptchaId] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setCaptchaAnswer('')
    setError('')
  }

  const refreshCaptcha = async () => {
    try {
      const data = await getCaptcha()
      setCaptchaId(data.captcha_id)
      setCaptchaImage(data.image)
      setCaptchaAnswer('')
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (open) { resetForm(); setMode('login'); refreshCaptcha() }
  }, [open])

  const switchMode = (m: 'login' | 'register') => {
    setMode(m); resetForm(); refreshCaptcha(); setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password || !captchaAnswer.trim()) {
      setError('请填写所有字段'); return
    }
    if (mode === 'register') {
      if (!email.trim()) { setError('请输入邮箱'); return }
      if (password !== confirmPassword) { setError('两次密码不一致'); return }
      if (password.length < 8) { setError('密码长度不能少于8位'); return }
    }

    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(username.trim(), password, captchaId, captchaAnswer.trim())
      } else {
        await register(username.trim(), email.trim(), password, captchaId, captchaAnswer.trim())
      }
      onClose()
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      if (detail === 'Invalid or expired captcha') {
        setError('验证码错误，请刷新重试'); refreshCaptcha()
      } else {
        setError(detail || (mode === 'login' ? '用户名或密码错误' : '注册失败'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 弹窗 */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transition-colors">
        {/* 关闭按钮 */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors z-10">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 头部 Tab */}
        <div className="flex border-b border-slate-200 dark:border-gray-700">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 relative ${
              mode === 'login'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            登录
            {mode === 'login' && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-500 rounded-full" />}
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 relative ${
              mode === 'register'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            注册
            {mode === 'register' && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-500 rounded-full" />}
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="用户名"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              autoComplete="username" />
          </div>

          {mode === 'register' && (
            <div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="邮箱"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                autoComplete="email" />
            </div>
          )}

          <div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="密码"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </div>

          {mode === 'register' && (
            <div>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="确认密码"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                autoComplete="new-password" />
            </div>
          )}

          {/* 验证码 */}
          <div className="flex gap-2 items-stretch">
            {captchaImage ? (
              <img src={captchaImage} alt="验证码" onClick={refreshCaptcha}
                className="h-11 rounded-xl border border-slate-200 dark:border-gray-600 cursor-pointer shrink-0" />
            ) : (
              <div className="h-11 w-32 rounded-xl bg-slate-100 dark:bg-gray-800 animate-pulse shrink-0" />
            )}
            <input type="text" value={captchaAnswer} onChange={e => setCaptchaAnswer(e.target.value)}
              placeholder="请输入验证码"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              autoComplete="off" />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
            {submitting ? '请稍候...' : (mode === 'login' ? '登录' : '注册')}
          </button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            {mode === 'login' ? (
              <>还没有账号？<button type="button" onClick={() => switchMode('register')} className="text-blue-500 hover:text-blue-600 font-medium ml-1">立即注册</button></>
            ) : (
              <>已有账号？<button type="button" onClick={() => switchMode('login')} className="text-blue-500 hover:text-blue-600 font-medium ml-1">立即登录</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
