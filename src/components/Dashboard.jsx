import { useState } from 'react'

export default function Dashboard({ onClose }) {
  const [url, setUrl] = useState(localStorage.getItem('showreel_url') || '')

  const save = () => {
    if (url.trim()) {
      localStorage.setItem('showreel_url', url.trim())
    } else {
      localStorage.removeItem('showreel_url')
    }
    window.dispatchEvent(new Event('showreel-updated'))
    onClose?.()
  }

  return (
    <div className="dash-panel" onClick={e => e.stopPropagation()}>
      <div className="dash-title">Showreel URL</div>
      <input
        className="dash-input"
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Paste YouTube or Vimeo embed URL..."
        onKeyDown={e => e.key === 'Enter' && save()}
      />
      <button className="dash-save" onClick={save}>Save</button>
    </div>
  )
}
