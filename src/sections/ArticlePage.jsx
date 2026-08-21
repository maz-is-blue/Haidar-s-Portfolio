import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../LanguageContext.jsx'
import { getArticle } from '../services/api.js'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'

export default function ArticlePage() {
  const { id } = useParams()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getArticle(id)
      .then(r => setArticle(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const title   = article ? (lang === 'ar' ? article.title_ar   : article.title_en)   : ''
  const content = article ? (lang === 'ar' ? article.content_ar : article.content_en) : ''
  const excerpt = article ? (lang === 'ar' ? article.excerpt_ar : article.excerpt_en) : ''

  const navSetPage = (p) => navigate(p === 'home' ? '/' : `/?goto=${p}`)

  return (
    <div id="site-root" dir={t.dir}>
      <Nav page="articles" setPage={navSetPage} />

      <div className="article-page">
        {loading && (
          <div className="article-page-state">Loading…</div>
        )}
        {notFound && (
          <div className="article-page-state">Article not found.</div>
        )}
        {article && (
          <>
            {article.cover_image_url && (
              <div className="article-page-cover-wrap">
                <img src={article.cover_image_url} alt={title} className="article-page-cover" />
              </div>
            )}
            <div className="article-page-body">
              <button className="article-page-back" onClick={() => navigate(-1)}>
                ← {lang === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <div className="article-page-pub">{article.pub}</div>
              <h1 className="article-page-title">{title}</h1>
              {content ? (
                <div
                  className="article-page-content"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p className="article-page-content">{excerpt}</p>
              )}
              {(article.links || []).length > 0 && (
                <div className="article-page-links">
                  {article.links.map((l, i) => (
                    <a key={i} className="read-link" href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
