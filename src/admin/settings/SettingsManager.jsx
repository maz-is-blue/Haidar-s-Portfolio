import { useState, useEffect, useRef } from 'react'
import { adminGetSettings, adminUpdateSettings, adminUploadOgCover } from '../../services/api.js'

export default function SettingsManager() {
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverProgress, setCoverProgress] = useState(0)
  const coverInputRef = useRef(null)

  useEffect(() => {
    adminGetSettings().then((r) => setSettings(r.data)).catch(() => {})
  }, [])

  const set = (key, val) => setSettings((s) => ({ ...s, [key]: val }))

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setAlert(null)
    try {
      await adminUpdateSettings(settings)
      setAlert({ type: 'success', msg: 'Settings saved.' })
    } catch { setAlert({ type: 'error', msg: 'Failed to save.' }) }
    setSaving(false)
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setCoverUploading(true); setCoverProgress(0); setAlert(null)
    try {
      const r = await adminUploadOgCover(file, pct => setCoverProgress(pct))
      setSettings(s => ({ ...s, og_cover_url: r.data.url }))
      setAlert({ type: 'success', msg: 'Cover image uploaded.' })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Upload failed.'
      setAlert({ type: 'error', msg })
    }
    setCoverUploading(false)
    coverInputRef.current.value = ''
  }

  if (!settings) return <div className="admin-loading">Loading…</div>

  return (
    <>
      <div className="admin-topbar"><h1>Site Settings</h1></div>
      <div className="admin-content">
        {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}
        <form onSubmit={save}>
          {/* Hero */}
          <div className="admin-card">
            <div className="admin-card-header"><div className="admin-card-title">Hero Section</div></div>
            <div className="admin-form-grid">
              <div className="admin-field light">
                <label>Kicker (EN)</label>
                <input value={settings.hero_kicker_en || ''} onChange={(e) => set('hero_kicker_en', e.target.value)} placeholder="Syrian Journalist — 14 Years in the Field" />
              </div>
              <div className="admin-field light" dir="rtl">
                <label>الكيكر (عربي)</label>
                <input value={settings.hero_kicker_ar || ''} onChange={(e) => set('hero_kicker_ar', e.target.value)} />
              </div>
              <div className="admin-field light">
                <label>Tagline (EN)</label>
                <textarea rows={2} value={settings.hero_tagline_en || ''} onChange={(e) => set('hero_tagline_en', e.target.value)} />
              </div>
              <div className="admin-field light" dir="rtl">
                <label>الوصف (عربي)</label>
                <textarea rows={2} value={settings.hero_tagline_ar || ''} onChange={(e) => set('hero_tagline_ar', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Showreel Caption */}
          <div className="admin-card">
            <div className="admin-card-header"><div className="admin-card-title">Showreel Caption</div></div>
            <div className="admin-field light">
              <label>Caption (EN)</label>
              <input value={settings.showreel_caption_en || ''} onChange={(e) => set('showreel_caption_en', e.target.value)} />
            </div>
          </div>

          {/* OG Cover */}
          <div className="admin-card">
            <div className="admin-card-header"><div className="admin-card-title">Link Preview Cover Image</div></div>
            <div style={{ padding: '16px 24px 24px' }}>
              <div className="admin-hint" style={{ marginBottom: 16 }}>
                This image appears when sharing the site on LinkedIn, Twitter, WhatsApp, etc. Recommended size: 1200×630px.
              </div>
              {settings.og_cover_url && (
                <img
                  src={settings.og_cover_url}
                  alt="OG Cover"
                  style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block', marginBottom: 16, borderRadius: 2 }}
                />
              )}
              <div className="admin-field light">
                <label>Upload New Cover</label>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverUpload}
                  disabled={coverUploading}
                />
                <div className="admin-hint">JPEG, PNG or WebP — max 10 MB</div>
              </div>
              {coverUploading && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'monospace', color: '#888', marginBottom: 6 }}>
                    <span>Uploading…</span><span>{coverProgress}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e8e5df', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${coverProgress}%`, background: '#4A5240', borderRadius: 3, transition: 'width 0.2s ease' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="admin-card">
            <div className="admin-card-header"><div className="admin-card-title">Stats Bar</div></div>
            <p className="admin-card" style={{ border: 'none', padding: 0, marginBottom: 16 }}>
              Stored as JSON array. Format: <code>[{'{'}n:"14+",l_en:"Years",l_ar:"سنة"{'}'},…]</code>
            </p>
            <div className="admin-field light">
              <label>Stats JSON</label>
              <textarea
                rows={6}
                value={settings.stats_json || '[]'}
                onChange={(e) => set('stats_json', e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
              />
            </div>
          </div>

          {/* Media Orgs */}
          <div className="admin-card">
            <div className="admin-card-header"><div className="admin-card-title">Media Organizations</div></div>
            <div className="admin-field light">
              <label>Orgs JSON (name, wire: true/false)</label>
              <textarea
                rows={8}
                value={settings.orgs_json || '[]'}
                onChange={(e) => set('orgs_json', e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="admin-card">
            <div className="admin-card-header"><div className="admin-card-title">Contact Information</div></div>
            <div className="admin-form-grid">
              <div className="admin-field light">
                <label>Email</label>
                <input value={settings.contact_email || ''} onChange={(e) => set('contact_email', e.target.value)} />
              </div>
              <div className="admin-field light">
                <label>Phone</label>
                <input value={settings.contact_phone || ''} onChange={(e) => set('contact_phone', e.target.value)} />
              </div>
              <div className="admin-field light">
                <label>WhatsApp</label>
                <input value={settings.contact_whatsapp || ''} onChange={(e) => set('contact_whatsapp', e.target.value)} />
              </div>
              <div className="admin-field light">
                <label>LinkedIn Handle</label>
                <input value={settings.contact_linkedin || ''} onChange={(e) => set('contact_linkedin', e.target.value)} />
              </div>
              <div className="admin-field light">
                <label>Location (EN)</label>
                <input value={settings.contact_location_en || ''} onChange={(e) => set('contact_location_en', e.target.value)} />
              </div>
              <div className="admin-field light">
                <label>الموقع (عربي)</label>
                <input value={settings.contact_location_ar || ''} onChange={(e) => set('contact_location_ar', e.target.value)} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-admin-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save All Settings'}
          </button>
        </form>
      </div>
    </>
  )
}
