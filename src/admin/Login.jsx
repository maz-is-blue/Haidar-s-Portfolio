import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-box" onSubmit={submit}>
        <div className="admin-login-logo">HAIDAR MUSTAFA</div>
        <div className="admin-login-sub">Admin Dashboard</div>
        {error && <div className="admin-login-error">{error}</div>}
        <div className="admin-field">
          <label>Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            required autoFocus placeholder="admin@example.com"
          />
        </div>
        <div className="admin-field">
          <label>Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            required placeholder="••••••••"
          />
        </div>
        <button className="admin-login-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
