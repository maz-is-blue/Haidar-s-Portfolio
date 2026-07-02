import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import HeroCanvas from '../components/HeroCanvas.jsx'
import { getSettings } from '../services/api.js'

export default function Home({ goTo }) {
  const { t, lang } = useLanguage()
  const [apiSettings, setApiSettings] = useState(null)

  useEffect(() => {
    getSettings().then((r) => setApiSettings(r.data)).catch(() => {})
  }, [])

  // Use API data when available, fall back to content.js
  const kicker  = apiSettings ? (lang === 'ar' ? apiSettings.hero_kicker_ar  : apiSettings.hero_kicker_en)  || t.hero.kicker  : t.hero.kicker
  const tagline = apiSettings ? (lang === 'ar' ? apiSettings.hero_tagline_ar : apiSettings.hero_tagline_en) || t.hero.tagline : t.hero.tagline

  const statsRaw = apiSettings?.stats_json
  const stats = statsRaw ? JSON.parse(statsRaw).map((s) => ({ n: s.n, l: lang === 'ar' ? s.l_ar : s.l_en })) : t.stats

  const orgsRaw = apiSettings?.orgs_json
  const orgs = orgsRaw ? JSON.parse(orgsRaw) : t.orgs

  const showreelUrl = apiSettings?.showreel_url || t.showreel.videoUrl
  const showreelCap = apiSettings ? (lang === 'ar' ? apiSettings.showreel_caption_ar : apiSettings.showreel_caption_en) || t.showreel.caption : t.showreel.caption

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
            <iframe src={showreelUrl} title="Showreel" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
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
    </div>
  )
}
