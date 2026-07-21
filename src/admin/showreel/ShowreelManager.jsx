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
      const r = await adminUploadShowreel(file)
      setCurrentUrl(r.data.url)
      setAlert({ type: 'success', msg: 'Showreel uploaded successfully.' })
    } catch {
      setAlert({ type: 'error', msg: 'Upload failed. Max 500 MB — accepted formats: mp4, webm, mov.' })
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
              <div className="admin-hint">
                {uploading ? 'Uploading — please wait, large files may take a moment…' : 'Accepted: mp4, webm, mov — max 500 MB'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
