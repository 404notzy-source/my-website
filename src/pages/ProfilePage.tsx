import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { uploadAvatar } from '../services/auth'

const LEVEL_NAMES: Record<number, string> = {
  1: '青铜会员',
  2: '白银会员',
  3: '黄金会员',
  4: '钻石会员',
}

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-amber-700/10 text-amber-700 dark:bg-amber-700/20 dark:text-amber-400',
  2: 'bg-gray-400/10 text-gray-600 dark:bg-gray-400/20 dark:text-gray-300',
  3: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
  4: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
}

export default function ProfilePage() {
  const { state, refreshUser } = useAuth()
  const { user } = state

  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  if (!user) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await uploadAvatar(file)
      await refreshUser()
    } catch {
      // silently fail
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-24 pb-20 transition-colors duration-700">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">我的</h1>

        {/* 用户信息卡片 */}
        <div className="mt-8 p-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
          <div className="flex items-center gap-4">
            {/* 头像 - 可点击上传 */}
            <div className="relative shrink-0 w-20 h-20 rounded-full overflow-hidden bg-slate-200 dark:bg-gray-700 group cursor-pointer"
                 onClick={() => fileRef.current?.click()}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="头像" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">
                  {uploading ? '上传中...' : '更换头像'}
                </span>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                {user.username}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {user.email}
              </p>
              <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium ${LEVEL_COLORS[user.level] || LEVEL_COLORS[1]}`}>
                {LEVEL_NAMES[user.level] || '青铜会员'}
              </span>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link
            to="/history"
            className="p-4 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
              {user.browse_count}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              浏览足迹
              <span className="ml-1 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </p>
          </Link>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center transition-colors">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {LEVEL_NAMES[user.level]}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">会员等级</p>
          </div>
        </div>
      </div>
    </div>
  )
}
