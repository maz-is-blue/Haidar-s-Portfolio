import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import { getAbout } from '../services/api.js'
import api from '../services/api.js'

export default function About() {
  const { t, lang } = useLanguage()
  const [data, setData] = useState(null)
  const [certs, setCerts] = useState([])

  useEffect(() => {
    getAbout().then((r) => setData(r.data)).catch(() => {})
    api.get('/public/certifications').then((r) => setCerts(r.data)).catch(() => setCerts([]))
  }, [])

  const bio    = data ? (lang === 'ar' ? data.bio_ar    : data.bio_en)    || [] : t.about.bio
  const skills = data ? (lang === 'ar' ? data.skills_ar : data.skills_en) || [] : t.about.skills
  const portrait = data?.portrait_url

  const certName = (c) => lang === 'ar' ? c.name_ar : c.name_en
  const certOrg  = (c) => lang === 'ar' ? c.org_ar  : c.org_en

  const displayCerts = certs.length > 0 ? certs : t.about.certs.map((c) => ({ name_en: c.name, name_ar: c.name, org_en: c.org, org_ar: c.org }))

  return (
    <div>
      <div className="page-hdr">
        <div className="page-hdr-inner">
          <div className="page-title">{t.about.title}</div>
          <div className="page-sub">{t.about.sub}</div>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-l">
          <div className="about-photo">
            {portrait ? (
              <img src={portrait} alt="Haidar Mustafa" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <span className="about-photo-text">Portrait — upload photo</span>
            )}
          </div>
          <div className="section-label" style={{ marginBottom: 12 }}>
            <span className="section-label-text">{t.about.langLabel}</span>
            <div className="section-label-line"></div>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            {t.about.langs.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {i > 0 && <span style={{ color: 'var(--rule)' }}>·</span>}
                <div className="lang-item">
                  <strong>{l.name}</strong>
                  {l.level}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-r">
          <div className="about-bio" style={{ marginBottom: 28 }}>
            {bio.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="section-label" style={{ marginBottom: 14 }}>
            <span className="section-label-text">{t.about.skillsLabel}</span>
            <div className="section-label-line"></div>
          </div>
          <div className="skills-list">
            {skills.map((s, i) => <div className="skill-item" key={i}>{s}</div>)}
          </div>

          <div className="section-label" style={{ margin: '28px 0 14px' }}>
            <span className="section-label-text">{t.about.certsLabel}</span>
            <div className="section-label-line"></div>
          </div>
          {displayCerts.map((c, i) => (
            <div className="cert-row" key={i}>
              <div className="cert-name">{certName(c)}</div>
              <div className="cert-org">{certOrg(c)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
