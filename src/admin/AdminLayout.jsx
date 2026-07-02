import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { section: 'Content' },
  { to: '/admin/articles', label: 'Articles', icon: '✎' },
  { to: '/admin/gallery', label: 'Gallery', icon: '◫' },
  { to: '/admin/work', label: 'Work Reports', icon: '◈' },
  { to: '/admin/coverage', label: 'Major Coverage', icon: '◉' },
  { to: '/admin/experience', label: 'Experience', icon: '◷' },
  { section: 'Pages' },
  { to: '/admin/about', label: 'About', icon: '◌' },
  { to: '/admin/settings', label: 'Site Settings', icon: '◎' },
  { section: 'Inbox' },
  { to: '/admin/messages', label: 'Messages', icon: '◻' },
]

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          Haidar<br />Mustafa
          <small>Admin Panel</small>
        </div>
        <nav className="admin-nav">
          {NAV.map((item, i) =>
            item.section ? (
              <div className="admin-nav-section" key={i}>{item.section}</div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            )
          )}
        </nav>
        <div className="admin-sidebar-footer">
          <div style={{ fontSize: '0.62rem', color: '#555', marginBottom: '10px', letterSpacing: '0.1em' }}>
            {admin?.email}
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
