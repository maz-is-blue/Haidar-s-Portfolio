import { useState, useEffect } from 'react'
import {
  adminGetArticles, adminGetPhotos, adminGetVideos,
  adminGetMessages, adminGetExperiences, adminGetWorkReports
} from '../services/api.js'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState({
    articles: 0, photos: 0, videos: 0, messages: 0, experiences: 0, reports: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      adminGetArticles(), adminGetPhotos(), adminGetVideos(),
      adminGetMessages(), adminGetExperiences(), adminGetWorkReports()
    ]).then(([a, p, v, m, e, r]) => {
      setStats({
        articles: a.data.length,
        photos: p.data.length,
        videos: v.data.length,
        messages: m.data.filter((x) => !x.read_at).length,
        experiences: e.data.length,
        reports: r.data.length,
      })
    }).catch(() => {})
  }, [])

  const statCards = [
    { n: stats.articles, l: 'Articles', path: '/admin/articles' },
    { n: stats.reports, l: 'Work Reports', path: '/admin/work' },
    { n: stats.photos, l: 'Photos', path: '/admin/gallery' },
    { n: stats.videos, l: 'Videos', path: '/admin/gallery' },
    { n: stats.experiences, l: 'Experience', path: '/admin/experience' },
    { n: stats.messages, l: 'Unread Messages', path: '/admin/messages' },
  ]

  const quickLinks = [
    { label: '+ New Article', path: '/admin/articles/new' },
    { label: '+ Upload Photo/Video', path: '/admin/gallery' },
    { label: '+ Work Report', path: '/admin/work' },
    { label: '+ Coverage Event', path: '/admin/coverage' },
    { label: 'Edit About Page', path: '/admin/about' },
    { label: 'Site Settings', path: '/admin/settings' },
  ]

  return (
    <>
      <div className="admin-topbar">
        <h1>Dashboard</h1>
        <div className="admin-topbar-right">
          <span className="admin-user-badge">Haidar Mustafa Portfolio</span>
        </div>
      </div>
      <div className="admin-content">
        <div className="dashboard-stats">
          {statCards.map((s) => (
            <div
              key={s.l} className="dash-stat"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(s.path)}
            >
              <div className="dash-stat-n">{s.n}</div>
              <div className="dash-stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Quick Actions</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {quickLinks.map((q) => (
              <button
                key={q.label} className="btn-admin-secondary"
                onClick={() => navigate(q.path)}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
