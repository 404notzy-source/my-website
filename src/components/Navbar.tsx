import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

export interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  brandName: string
  items: NavItem[]
}

export default function Navbar({ brandName, items }: NavbarProps) {
  const { totalItems, lastAddedTime } = useCart()
  const { state, logout } = useAuth()
  const [badgePop, setBadgePop] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    if (lastAddedTime > 0) {
      setBadgePop(true)
      const timer = setTimeout(() => setBadgePop(false), 500)
      return () => clearTimeout(timer)
    }
  }, [lastAddedTime])

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-slate-200/50 dark:border-gray-800/50 transition-colors duration-500 pr-16">
        <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* 左侧：品牌名 */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {brandName}
          </Link>

          {/* 右侧：导航链接 */}
          <ul className="flex items-center gap-3 sm:gap-6">
            {items.map(item => {
              // 购物车
              if (item.href === '/cart') {
                return (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `relative text-sm sm:text-base font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400 ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                        }`
                      }
                    >
                      {item.label}
                      {totalItems > 0 && (
                        <span
                          className={`absolute -top-2 -right-5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full transition-transform duration-300 ${
                            badgePop ? 'scale-150 bg-green-500' : 'scale-100'
                          }`}
                        >
                          {totalItems > 99 ? '99+' : totalItems}
                        </span>
                      )}
                    </NavLink>
                  </li>
                )
              }

              // 关于我 — 弹出框
              if (item.href === '#about') {
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => setAboutOpen(true)}
                      className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                )
              }

              // 普通链接
              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `text-sm sm:text-base font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400 ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              )
            })}

            {/* 用户头像/登录 */}
            {state.isAuthenticated ? (
              <li className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-400 transition-all"
                >
                  {state.user?.avatar_url ? (
                    <img src={state.user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-bold">
                      {state.user?.username?.charAt(0).toUpperCase() || '?'}
                    </span>
                  )}
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-32 py-1 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg z-20">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        我的
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        退出
                      </button>
                    </div>
                  </>
                )}
              </li>
            ) : (
              <li>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  登录
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Auth 弹窗 */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* 关于我弹窗 */}
      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAboutOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-80 mx-4 transition-colors">
            <button
              onClick={() => setAboutOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">关于我</h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-14">名称</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">大超潮牌店</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-14">电话</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">18030032410</span>
              </div>
            </div>

            {/* WhatsApp 二维码 */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <a
                href="https://wa.me/8618030032410"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border border-slate-200 dark:border-gray-600 hover:ring-2 hover:ring-green-400 transition-all"
              >
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://wa.me/8618030032410"
                  alt="WhatsApp 二维码"
                  className="w-40 h-40"
                />
              </a>
              <span className="text-xs text-gray-400 dark:text-gray-500">扫码或点击联系 WhatsApp</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
