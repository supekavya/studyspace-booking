import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (username, password) => {
    setLoading(true); setError(null)
    try {
      const res = await authApi.login(username, password)
      const { token, ...userData } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.'
      setError(msg)
      return { success: false, error: msg }
    } finally { setLoading(false) }
  }

  const register = async (data) => {
    setLoading(true); setError(null)
    try {
      await authApi.register(data)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.'
      setError(msg)
      return { success: false, error: msg }
    } finally { setLoading(false) }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
