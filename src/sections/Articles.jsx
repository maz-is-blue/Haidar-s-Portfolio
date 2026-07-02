import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import { getArticles } from '../services/api.js'

export default function Articles() {
  const { t, lang } = useLanguage()
  const [articles, setArticles] = useState([])

  useEffect(() => {
    getArticles().then((r) => setArticles(r.data)).catch(() => setArticles([]))
  }, [])

  const title   = (a) => lang === 'ar' ? a.title_ar   : a.title_en
  const excerpt = (a) => lang === 'ar' ? a.excerpt_ar : a.excerpt_en

  return (
    <div>
      <div className="page-hdr">
        <div className="page-hdr-inner">
          <div className="page-title">{t.articles.title}</div>
          <div className="page-sub">{t.articles.sub}</div>
        </div>
      </div>

      <div className="art-grid">
        {articles.map((a) => (
          <div className="art-card" key={a.id}>
            {a.cover_image_url ? (
              <img src={a.cover_image_url} alt={title(a)} className="art-img" style={{ objectFit: 'cover', width: '100%', height: 200, display: 'block' }} />
            ) : (
              <div className="art-img"><span className="img-ph-text">Cover image</span></div>
            )}
            <div className="art-pub">{a.pub}</div>
            <div className="art-title">{title(a)}</div>
            <div className="art-excerpt">{excerpt(a)}</div>
            {(a.links || []).length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {a.links.map((l, i) => (
                  <a key={i} className="read-link" href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem' }}>
                    {l.label} →
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
