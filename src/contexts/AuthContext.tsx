import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react'
import { configureAxios } from '../services/axios'
import * as authApi from '../services/auth'
import type { User } from '../services/auth'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  loading: boolean
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; user: User; accessToken: string }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESHED'; accessToken: string }
  | { type: 'SET_USER'; user: User }
  | { type: 'LOADING_DONE' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        user: action.user,
        accessToken: action.accessToken,
        isAuthenticated: true,
        loading: false,
      }
    case 'LOGOUT':
      return { user: null, accessToken: null, isAuthenticated: false, loading: false }
    case 'TOKEN_REFRESHED':
      return { ...state, accessToken: action.accessToken, isAuthenticated: true, loading: false }
    case 'SET_USER':
      return { ...state, user: action.user }
    case 'LOADING_DONE':
      return { ...state, loading: false }
    default:
      return state
  }
}

interface AuthContextValue {
  state: AuthState
  login: (username: string, password: string, captchaId: string, captchaAnswer: string) => Promise<void>
  register: (username: string, email: string, password: string, captchaId: string, captchaAnswer: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: true,
  })

  const tokenRef = useRef<string | null>(null)

  useEffect(() => {
    tokenRef.current = state.accessToken
  }, [state.accessToken])

  useEffect(() => {
    const tempToken = localStorage.getItem('access_token_temp')
    if (tempToken) {
      tokenRef.current = tempToken
      localStorage.removeItem('access_token_temp')
    }
    configureAxios(
      () => tokenRef.current,
      () => dispatch({ type: 'LOGOUT' })
    )
  }, [])

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      dispatch({ type: 'LOADING_DONE' })
      return
    }
    authApi
      .refreshToken(refreshToken)
      .then(res => {
        dispatch({ type: 'TOKEN_REFRESHED', accessToken: res.access_token })
        return authApi.getMe()
      })
      .then(user => {
        if (user) dispatch({ type: 'SET_USER', user })
      })
      .catch(() => {
        localStorage.removeItem('refresh_token')
        dispatch({ type: 'LOADING_DONE' })
      })
  }, [])

  const login = async (username: string, password: string, captchaId: string, captchaAnswer: string) => {
    const res = await authApi.login(username, password, captchaId, captchaAnswer)
    localStorage.setItem('refresh_token', res.refresh_token)
    dispatch({ type: 'LOGIN_SUCCESS', user: res.user, accessToken: res.access_token })
  }

  const register = async (username: string, email: string, password: string, captchaId: string, captchaAnswer: string) => {
    const res = await authApi.register(username, email, password, captchaId, captchaAnswer)
    localStorage.setItem('refresh_token', res.refresh_token)
    dispatch({ type: 'LOGIN_SUCCESS', user: res.user, accessToken: res.access_token })
  }

  const logout = () => {
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('access_token_temp')
    dispatch({ type: 'LOGOUT' })
  }

  const refreshUser = async () => {
    try {
      const user = await authApi.getMe()
      dispatch({ type: 'SET_USER', user })
    } catch {
      // silently fail
    }
  }

  return (
    <AuthContext.Provider value={{ state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
