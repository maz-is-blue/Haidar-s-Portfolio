import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminGetArticles, adminDeleteArticle } from '../../services/api.js'

export default function ArticlesList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = () => {
    adminGetArticles().then((r) => setArticles(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const del = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    await adminDeleteArticle(id)
    load()
  }

  return (
    <>
      <div className="admin-topbar">
        <h1>Articles</h1>
        <div className="admin-topbar-right">
          <button className="btn-admin-primary" onClick={() => navigate('/admin/articles/new')}>
            + New Article
          </button>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#aaa', fontSize: '0.8rem' }}>Loading…</div>
          ) : articles.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">✎</div>
              <p>No articles yet. Create your first one.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title (EN)</th>
                  <th>Publication</th>
                  <th>Links</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id}>
                    <td style={{ maxWidth: 300 }}>
                      <div style={{ fontWeight: 500, marginBottom: 3 }}>{a.title_en || '—'}</div>
                      <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{a.title_ar || ''}</div>
                    </td>
                    <td>{a.pub || '—'}</td>
                    <td>{a.links?.length || 0}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn-admin-secondary" onClick={() => navigate(`/admin/articles/${a.id}`)}>
                          Edit
                        </button>
                        <button className="btn-admin-danger" onClick={() => del(a.id, a.title_en)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
