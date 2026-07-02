import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import { getWorkReports, getCoverages } from '../services/api.js'

export default function Work() {
  const { t, lang } = useLanguage()
  const [reports, setReports] = useState([])
  const [coverages, setCoverages] = useState([])

  useEffect(() => {
    getWorkReports().then((r) => setReports(r.data)).catch(() => setReports([]))
    getCoverages().then((r) => setCoverages(r.data)).catch(() => setCoverages([]))
  }, [])

  const title    = (r) => lang === 'ar' ? r.title_ar    : r.title_en
  const desc     = (r) => lang === 'ar' ? r.desc_ar     : r.desc_en
  const linkLbl  = (r) => lang === 'ar' ? r.link_label_ar : r.link_label_en
  const covName  = (c) => lang === 'ar' ? c.name_ar     : c.name_en
  const covDesc  = (c) => lang === 'ar' ? c.desc_ar     : c.desc_en

  return (
    <div>
      <div className="page-hdr">
        <div className="page-hdr-inner">
          <div className="page-title">{t.work.title}</div>
          <div className="page-sub">{t.work.sub}</div>
        </div>
      </div>

      <div className="reports-grid">
        {reports.map((r) => (
          <div className="report-card" key={r.id}>
            {r.cover_image_url ? (
              <img src={r.cover_image_url} alt={title(r)} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
            ) : (
              <div className="img-ph"><span className="img-ph-text">Photo placeholder</span></div>
            )}
            <div className="report-src">{r.src}</div>
            <div className="report-title">{title(r)}</div>
            <div className="report-desc">{desc(r)}</div>
            {r.link && (
              <a className="read-link" href={r.link} target="_blank" rel="noopener noreferrer">
                {linkLbl(r) || 'Read More'} →
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="page-hdr" style={{ marginTop: 0 }}>
        <div className="page-hdr-inner" style={{ marginTop: 24 }}>
          <div className="page-title">{t.coverage.title}</div>
          <div className="page-sub">{t.coverage.sub}</div>
        </div>
      </div>

      <div className="coverage-wrap">
        {coverages.map((c) => (
          <div className="cov-item" key={c.id}>
            <div className="cov-top">
              <div className="cov-name">{covName(c)}</div>
              <div className="cov-yr">{c.year}</div>
            </div>
            <div className="cov-desc">{covDesc(c)}</div>
            <div className="cov-links">
              {(c.links || []).map((l, j) => (
                <a className="pill" href={l.url} target="_blank" rel="noopener noreferrer" key={j}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
