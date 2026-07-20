import { useState } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import Dashboard from './Dashboard.jsx'

export default function Footer() {
  const { t } = useLanguage()
  const [dashOpen, setDashOpen] = useState(false)

  return (
    <div className="footer">
      <div className="footer-brand">{t.footer.brand}</div>
      <div className="footer-copy">{t.footer.copy}</div>
      <button
        className="footer-gear"
        onClick={() => setDashOpen(d => !d)}
        title="Showreel settings"
      >
        ⚙
      </button>
      {dashOpen && <Dashboard onClose={() => setDashOpen(false)} />}
    </div>
  )
}
