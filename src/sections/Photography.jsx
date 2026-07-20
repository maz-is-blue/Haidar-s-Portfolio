import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import { getPhotos, getVideos } from '../services/api.js'

function buildCategoriesFromApi(photos, lang) {
  const catField = lang === 'ar' ? 'cat_ar' : 'cat_en'
  const titleField = lang === 'ar' ? 'title_ar' : 'title_en'
  const map = {}
  const order = []
  photos.forEach(p => {
    const cat = p[catField] || (lang === 'ar' ? 'أخرى' : 'Other')
    if (!map[cat]) { map[cat] = { id: cat, label: cat, photos: [] }; order.push(cat) }
    map[cat].photos.push({ src: p.url || '', caption: p[titleField] || '' })
  })
  return order.map(k => map[k])
}

export default function Photography() {
  const { t, lang } = useLanguage()
  const [apiPhotos, setApiPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [tab, setTab] = useState('photos')
  const [activeId, setActiveId] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    getPhotos().then(r => setApiPhotos(r.data)).catch(() => setApiPhotos([]))
    getVideos().then(r => setVideos(r.data)).catch(() => setVideos([]))
  }, [])

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') { setLightbox(null); return }
      if (e.key === 'ArrowLeft') setLightbox(lb => lb ? { ...lb, i: (lb.i - 1 + lb.list.length) % lb.list.length } : null)
      if (e.key === 'ArrowRight') setLightbox(lb => lb ? { ...lb, i: (lb.i + 1) % lb.list.length } : null)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const categories = apiPhotos.length > 0
    ? buildCategoriesFromApi(apiPhotos, lang)
    : t.photography.categories

  const displayedPhotos = activeId === 'all'
    ? categories.flatMap(cat => cat.photos.map(p => ({ ...p, _catLabel: cat.label })))
    : (categories.find(c => c.id === activeId)?.photos ?? []).map(p => ({ ...p, _catLabel: null }))

  const titleFld = lang === 'ar' ? 'title_ar' : 'title_en'

  const openLightbox = i => setLightbox({ list: displayedPhotos, i })
  const prev = () => setLightbox(lb => lb ? { ...lb, i: (lb.i - 1 + lb.list.length) % lb.list.length } : null)
  const next = () => setLightbox(lb => lb ? { ...lb, i: (lb.i + 1) % lb.list.length } : null)

  return (
    <div>
      <div className="page-hdr">
        <div className="page-hdr-inner">
          <div className="page-title">{t.photography.title}</div>
          <div className="page-sub">{t.photography.sub}</div>
        </div>
      </div>

      <div className="photo-tabs">
        <button className={`ptab ${tab === 'photos' ? 'on' : ''}`} onClick={() => setTab('photos')}>
          {lang === 'ar' ? 'صور' : 'Photos'}
        </button>
        <button className={`ptab ${tab === 'videos' ? 'on' : ''}`} onClick={() => setTab('videos')}>
          {lang === 'ar' ? 'فيديو' : 'Videos'}
        </button>
      </div>

      {tab === 'photos' && (
        <>
          <div className="photo-tabs" style={{ paddingTop: 0 }}>
            <button className={`ptab ${activeId === 'all' ? 'on' : ''}`} onClick={() => setActiveId('all')}>
              {t.photography.allLabel}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`ptab ${activeId === cat.id ? 'on' : ''}`}
                onClick={() => setActiveId(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="photo-grid">
            {displayedPhotos.map((photo, i) => (
              <div className="photo-cell" key={i} onClick={() => openLightbox(i)}>
                {photo.src
                  ? <img src={photo.src} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <div className="photo-num">{String(i + 1).padStart(2, '0')}</div>
                }
                <div className="photo-hover">
                  <div className="photo-hover-title">
                    {activeId === 'all' ? photo._catLabel : photo.caption}
                  </div>
                  {activeId === 'all' && photo.caption && (
                    <div className="photo-hover-cat">{photo.caption}</div>
                  )}
                </div>
              </div>
            ))}
            {displayedPhotos.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#aaa', fontSize: '0.82rem' }}>
                {lang === 'ar' ? 'لا توجد صور بعد.' : 'No photos yet.'}
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'videos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24, padding: '32px 40px' }}>
          {videos.map(v => (
            <div key={v.id} style={{ border: '1px solid var(--rule)', background: '#fff' }}>
              {v.embed_url ? (
                <iframe src={v.embed_url} title={v[titleFld]} style={{ width: '100%', height: 200, border: 'none', display: 'block' }} allow="autoplay; fullscreen" allowFullScreen />
              ) : v.url ? (
                <video src={v.url} controls style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: 200, background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#888' }}>▷</div>
              )}
              <div style={{ padding: '12px 16px' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>{v[titleFld]}</div>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#aaa', fontSize: '0.82rem' }}>
              {lang === 'ar' ? 'لا توجد مقاطع فيديو بعد.' : 'No videos yet.'}
            </div>
          )}
        </div>
      )}

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button>
          {lightbox.list.length > 1 && (
            <button className="lightbox-prev" onClick={e => { e.stopPropagation(); prev() }}>‹</button>
          )}
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            {lightbox.list[lightbox.i].src
              ? <img className="lightbox-img" src={lightbox.list[lightbox.i].src} alt={lightbox.list[lightbox.i].caption} />
              : <div className="lightbox-placeholder">{String(lightbox.i + 1).padStart(2, '0')}</div>
            }
          </div>
          {lightbox.list.length > 1 && (
            <button className="lightbox-next" onClick={e => { e.stopPropagation(); next() }}>›</button>
          )}
          {lightbox.list[lightbox.i].caption && (
            <div className="lightbox-caption">{lightbox.list[lightbox.i].caption}</div>
          )}
        </div>
      )}
    </div>
  )
}
