import { useState, useEffect, useRef } from 'react'
import { adminGetSettings, adminUploadShowreel } from '../../services/api.js'

export default function ShowreelManager() {
  const [currentUrl, setCurrentUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [alert, setAlert] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    adminGetSettings().then(r => setCurrentUrl(r.data.showreel_url || null)).catch(() => {})
  }, [])

  const handleFile = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true); setProgress(0); setAlert(null)
    try {
      const r = await adminUploadShowreel(file, pct => setProgress(pct))
      setCurrentUrl(r.data.url)
      setProgress(100)
      setAlert({ type: 'success', msg: 'Showreel uploaded successfully.' })
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || JSON.stringify(err?.response?.data) || 'Upload failed.'
      setAlert({ type: 'error', msg: `Upload failed: ${msg}` })
    }
    setUploading(false)
    inputRef.current.value = ''
  }

  const isDirectVideo = currentUrl && /\.(mp4|webm|mov|avi)(\?|$)/i.test(currentUrl)

  return (
    <>
      <div className="admin-topbar"><h1>Showreel</h1></div>
      <div className="admin-content">
        {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}

        {currentUrl && (
          <div className="admin-card" style={{ marginBottom: 24 }}>
            <div className="admin-card-header"><div className="admin-card-title">Current Showreel</div></div>
            <div style={{ padding: '0 24px 24px' }}>
              {isDirectVideo ? (
                <video src={currentUrl} controls style={{ width: '100%', maxHeight: 400, background: '#000', display: 'block', borderRadius: 2 }} />
              ) : (
                <iframe src={currentUrl} title="Showreel" allowFullScreen style={{ width: '100%', height: 360, border: 'none', display: 'block' }} />
              )}
              <div className="admin-hint" style={{ marginTop: 8, wordBreak: 'break-all' }}>{currentUrl}</div>
            </div>
          </div>
        )}

        <div className="admin-card">
          <div className="admin-card-header"><div className="admin-card-title">Upload New Video</div></div>
          <div style={{ padding: '16px 24px 24px' }}>
            <div className="admin-field light">
              <label>Video File</label>
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFile}
                disabled={uploading}
              />
              <div className="admin-hint">Accepted: mp4, webm, mov — max 500 MB</div>
            </div>

            {uploading && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'monospace', color: '#888', marginBottom: 6 }}>
                  <span>Uploading…</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ height: 6, background: '#e8e5df', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#4A5240', borderRadius: 3, transition: 'width 0.2s ease' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
