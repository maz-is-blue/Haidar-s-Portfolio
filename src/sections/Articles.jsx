import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import { getArticles } from '../services/api.js'

export default function Articles() {
  const { t, lang } = useLanguage()
  const [articles, setArticles] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getArticles().then((r) => setArticles(r.data)).catch(() => setArticles([]))
  }, [])

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selected])

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const title   = (a) => lang === 'ar' ? a.title_ar   : a.title_en
  const excerpt = (a) => lang === 'ar' ? a.excerpt_ar : a.excerpt_en
  const content = (a) => lang === 'ar' ? a.content_ar : a.content_en

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
          <div className="art-card" key={a.id} onClick={() => setSelected(a)} style={{ cursor: 'pointer' }}>
            {a.cover_image_url ? (
              <img src={a.cover_image_url} alt={title(a)} className="art-img" style={{ objectFit: 'cover', width: '100%', height: 200, display: 'block' }} />
            ) : (
              <div className="art-img"><span className="img-ph-text">Cover image</span></div>
            )}
            <div className="art-pub">{a.pub}</div>
            <div className="art-title">{title(a)}</div>
            <div className="art-excerpt">{excerpt(a)}</div>
            {(a.links || []).length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }} onClick={e => e.stopPropagation()}>
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

      {selected && (
        <div className="article-modal-overlay" onClick={() => setSelected(null)}>
          <div className="article-modal" onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <button className="article-modal-close" onClick={() => setSelected(null)}>×</button>
            {selected.cover_image_url && (
              <img src={selected.cover_image_url} alt={title(selected)} style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }} />
            )}
            <div className="article-modal-body">
              <div className="article-modal-pub">{selected.pub}</div>
              <h2 className="article-modal-title">{title(selected)}</h2>
              {content(selected) ? (
                <div className="article-modal-content" dangerouslySetInnerHTML={{ __html: content(selected) }} />
              ) : (
                <p className="article-modal-content">{excerpt(selected)}</p>
              )}
              {(selected.links || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--rule)' }}>
                  {selected.links.map((l, i) => (
                    <a key={i} className="read-link" href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
