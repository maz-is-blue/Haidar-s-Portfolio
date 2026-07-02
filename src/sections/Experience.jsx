import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import { getExperiences } from '../services/api.js'

export default function Experience() {
  const { t, lang } = useLanguage()
  const [items, setItems] = useState([])

  useEffect(() => {
    getExperiences().then((r) => setItems(r.data)).catch(() => setItems([]))
  }, [])

  const role    = (e) => lang === 'ar' ? e.role_ar    : e.role_en
  const bullets = (e) => lang === 'ar' ? (e.bullets_ar || []) : (e.bullets_en || [])

  return (
    <div>
      <div className="page-hdr">
        <div className="page-hdr-inner">
          <div className="page-title">{t.experience.title}</div>
          <div className="page-sub">{t.experience.sub}</div>
        </div>
      </div>

      <div className="exp-wrap">
        {items.map((e) => (
          <div className="exp-item" key={e.id}>
            <div className="exp-meta">
              <span className="exp-yrs">{e.years}</span>
              <span className="exp-org">{e.org}</span>
            </div>
            <div>
              <div className="exp-role">{role(e)}</div>
              <ul className="exp-bullets">
                {bullets(e).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              {(e.links || []).length > 0 && (
                <div className="cov-links">
                  {e.links.map((l, j) => (
                    <a className="pill" href={l.url} target="_blank" rel="noopener noreferrer" key={j}>
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
