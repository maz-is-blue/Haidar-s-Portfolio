import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import HeroCanvas from '../components/HeroCanvas.jsx'
import { getSettings, getAbout } from '../services/api.js'

export default function Home({ goTo }) {
  const { t, lang } = useLanguage()
  const [apiSettings, setApiSettings] = useState(null)
  const [aboutData, setAboutData] = useState(null)
  const [localShowreelUrl, setLocalShowreelUrl] = useState(
    () => localStorage.getItem('showreel_url') || ''
  )

  useEffect(() => {
    getSettings().then(r => setApiSettings(r.data)).catch(() => {})
    getAbout().then(r => setAboutData(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const handler = () => setLocalShowreelUrl(localStorage.getItem('showreel_url') || '')
    window.addEventListener('showreel-updated', handler)
    return () => window.removeEventListener('showreel-updated', handler)
  }, [])

  const kicker  = apiSettings ? (lang === 'ar' ? apiSettings.hero_kicker_ar  : apiSettings.hero_kicker_en)  || t.hero.kicker  : t.hero.kicker
  const tagline = apiSettings ? (lang === 'ar' ? apiSettings.hero_tagline_ar : apiSettings.hero_tagline_en) || t.hero.tagline : t.hero.tagline

  const statsRaw = apiSettings?.stats_json
  const stats = statsRaw ? JSON.parse(statsRaw).map(s => ({ n: s.n, l: lang === 'ar' ? s.l_ar : s.l_en })) : t.stats

  const orgsRaw = apiSettings?.orgs_json
  const orgs = orgsRaw ? JSON.parse(orgsRaw) : t.orgs

  const showreelUrl = localShowreelUrl || apiSettings?.showreel_url || t.showreel.videoUrl
  const showreelCap = apiSettings ? (lang === 'ar' ? apiSettings.showreel_caption_ar : apiSettings.showreel_caption_en) || t.showreel.caption : t.showreel.caption

  const previewBio = lang === 'ar'
    ? (aboutData?.bio_ar?.[0] ?? t.about.bio[0])
    : (aboutData?.bio_en?.[0] ?? t.about.bio[0])
  const previewSkills = lang === 'ar'
    ? (aboutData?.skills_ar ?? t.about.skills)
    : (aboutData?.skills_en ?? t.about.skills)

  const tickerItems = [...t.ticker, ...t.ticker]

  return (
    <div>
      <div className="hero">
        <div className="hero-left">
          <div className="hero-kicker">{kicker}</div>
          <div className="hero-name">
            {t.hero.name1}
            <em>{t.hero.name2}</em>
          </div>
          <div className="hero-tagline">{tagline}</div>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => goTo('work')}>{t.hero.cta1}</button>
            <button className="btn-ghost" onClick={() => goTo('contact')}>{t.hero.cta2}</button>
          </div>
        </div>
        <div className="hero-right">
          <HeroCanvas />
        </div>
      </div>

      <div className="ticker">
        <div className="ticker-inner">
          {tickerItems.map((item, i) => (
            <span key={i}>{item}<span className="dot"> · </span></span>
          ))}
        </div>
      </div>

      <div className="stats-bar">
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <span className="stat-n">{s.n}</span>
            <span className="stat-l">{s.l}</span>
          </div>
        ))}
      </div>

      <div className="showreel-block">
        <div className="section-label">
          <span className="section-label-text">{t.showreel.label}</span>
          <div className="section-label-line"></div>
        </div>
        <div className="video-wrap">
          {showreelUrl ? (
            /\.(mp4|webm|mov|avi)(\?|$)/i.test(showreelUrl)
              ? <video src={showreelUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
              : <iframe src={showreelUrl} title="Showreel" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }} />
          ) : (
            <>
              <div className="video-corner tl"></div>
              <div className="video-corner tr"></div>
              <div className="video-corner bl"></div>
              <div className="video-corner br"></div>
              <button className="play-btn"><div className="play-tri"></div></button>
              <div className="video-caption">{showreelCap}</div>
            </>
          )}
        </div>
        <div className="showreel-tags">
          {t.showreel.tags.map((tag, i) => <span className="tag" key={i}>{tag}</span>)}
        </div>
      </div>

      <div className="orgs-block">
        <div className="section-label">
          <span className="section-label-text">{t.orgsLabel}</span>
          <div className="section-label-line"></div>
        </div>
        <div className="orgs-grid">
          {orgs.map((org, i) => (
            <div className={`org ${org.wire ? 'wire' : ''}`} key={i}>{org.name}</div>
          ))}
        </div>
      </div>

      {/* About Preview */}
      <div className="home-about-preview">
        <div className="home-preview-photo">
          <div className="home-preview-portrait">
            {aboutData?.portrait_url
              ? <img src={aboutData.portrait_url} alt={t.about.sub} />
              : <span className="about-photo-text">PORTRAIT</span>
            }
          </div>
        </div>
        <div className="home-preview-content">
          <div className="section-label" style={{ marginBottom: 20 }}>
            <span className="section-label-text">{t.about.title}</span>
            <div className="section-label-line"></div>
          </div>
          <p className="home-preview-bio">{previewBio}</p>
          <div className="skills-list" style={{ marginBottom: 24 }}>
            {previewSkills.slice(0, 6).map((s, i) => (
              <div className="skill-item" key={i}>{s}</div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => goTo('about')}>{t.about.previewBtn}</button>
        </div>
      </div>

      {/* Contact Preview */}
      <div className="home-contact-preview">
        <div className="section-label" style={{ marginBottom: 28 }}>
          <span className="section-label-text" style={{ color: 'var(--olive-pale)' }}>{t.contact.title}</span>
          <div className="section-label-line" style={{ background: '#2A2A22' }}></div>
        </div>
        <div className="home-contact-preview-inner">
          <div>
            <div className="home-contact-headline">
              {t.contact.headline1}
              {t.contact.headline2 && <> {t.contact.headline2}</>}
              {' '}
              <span>{t.contact.headline3}</span>
            </div>
            <button className="btn-primary" onClick={() => goTo('contact')}>{t.contact.previewBtn}</button>
          </div>
          <div>
            <ul className="contact-list" style={{ marginBottom: 20 }}>
              {t.contact.info.slice(0, 4).map((item, i) => (
                <li key={i}><strong>{item.label}</strong>{item.value}</li>
              ))}
            </ul>
            <div className="avail-wrap">
              {t.contact.avail.slice(0, 4).map((a, i) => (
                <span className="avail-tag" key={i}>{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
