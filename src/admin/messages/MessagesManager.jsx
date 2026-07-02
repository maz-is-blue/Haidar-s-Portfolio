import { useState, useEffect } from 'react'
import { adminGetMessages, adminMarkRead, adminDeleteMessage } from '../../services/api.js'

export default function MessagesManager() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetMessages().then((r) => setMessages(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const open = async (msg) => {
    setSelected(msg)
    if (!msg.read_at) {
      await adminMarkRead(msg.id)
      load()
    }
  }

  const del = async (id) => {
    if (!confirm('Delete this message?')) return
    await adminDeleteMessage(id)
    if (selected?.id === id) setSelected(null)
    load()
  }

  const unread = messages.filter((m) => !m.read_at).length

  return (
    <>
      <div className="admin-topbar">
        <h1>Messages {unread > 0 && <span style={{ fontSize: '1rem', color: '#4A5240' }}>({unread} unread)</span>}</h1>
      </div>
      <div className="admin-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
          {/* List */}
          <div className="admin-card" style={{ padding: 0 }}>
            {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Loading…</div>
              : messages.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">◻</div><p>No messages yet.</p></div>
                : (
                  <div>
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => open(m)}
                        style={{
                          padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid #f0ede8',
                          background: selected?.id === m.id ? '#faf9f6' : '#fff',
                          borderLeft: !m.read_at ? '3px solid #4A5240' : '3px solid transparent',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ fontWeight: m.read_at ? 400 : 600, fontSize: '0.82rem', color: '#0D0D0B' }}>{m.name}</div>
                          <div style={{ fontSize: '0.62rem', color: '#aaa', whiteSpace: 'nowrap' }}>{new Date(m.created_at).toLocaleDateString()}</div>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 2 }}>{m.email}</div>
                        <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {m.message?.slice(0, 60)}…
                        </div>
                      </div>
                    ))}
                  </div>
                )}
          </div>

          {/* Detail */}
          <div className="admin-card">
            {!selected ? (
              <div className="admin-empty"><div className="admin-empty-icon">◻</div><p>Select a message to read it.</p></div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '0.06em' }}>{selected.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 2 }}>{selected.email} {selected.org ? `· ${selected.org}` : ''}</div>
                    <div style={{ fontSize: '0.62rem', color: '#aaa', marginTop: 4 }}>{new Date(selected.created_at).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`mailto:${selected.email}`} className="btn-admin-secondary" style={{ textDecoration: 'none' }}>Reply ↗</a>
                    <button className="btn-admin-danger" onClick={() => del(selected.id)}>Delete</button>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #f0ede8', paddingTop: 20, fontSize: '0.88rem', lineHeight: 1.8, color: '#333', whiteSpace: 'pre-wrap' }}>
                  {selected.message}
                </div>
                {!selected.read_at && <span className="badge badge-unread" style={{ marginTop: 16, display: 'inline-block' }}>Unread</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
