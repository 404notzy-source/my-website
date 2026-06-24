import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

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
              <>
                <li>
                  <NavLink to="/login"
                    className={({ isActive }) =>
                      `text-sm sm:text-base font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400 ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                      }`
                    }
                  >登录</NavLink>
                </li>
                <li>
                  <NavLink to="/register"
                    className={({ isActive }) =>
                      `text-sm sm:text-base font-medium transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400 ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                      }`
                    }
                  >注册</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

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
                <span className="text-sm font-medium text-gray-900 dark:text-white">13302020278</span>
              </div>
            </div>

            {/* 二维码占位 */}
            <div className="mt-4 flex justify-center">
              <div className="w-36 h-36 rounded-lg border-2 border-dashed border-slate-200 dark:border-gray-600 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                <svg className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
                </svg>
                <span className="text-xs">二维码</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
