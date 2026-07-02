import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import { getPhotos, getVideos } from '../services/api.js'

export default function Photography() {
  const { t, lang } = useLanguage()
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [tab, setTab] = useState('photos')
  const [active, setActive] = useState('All')

  useEffect(() => {
    getPhotos().then((r) => setPhotos(r.data)).catch(() => setPhotos([]))
    getVideos().then((r) => setVideos(r.data)).catch(() => setVideos([]))
  }, [])

  const catField  = lang === 'ar' ? 'cat_ar' : 'cat_en'
  const titleFld  = lang === 'ar' ? 'title_ar' : 'title_en'
  const allLabel  = lang === 'ar' ? 'الكل' : 'All'

  const cats = [allLabel, ...new Set(photos.map((p) => p[catField]).filter(Boolean))]
  const filtered = active === allLabel ? photos : photos.filter((p) => p[catField] === active)

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
            {cats.map((f) => (
              <button key={f} className={`ptab ${active === f ? 'on' : ''}`} onClick={() => setActive(f)}>
                {f}
              </button>
            ))}
          </div>
          <div className="photo-grid">
            {filtered.map((p, i) => (
              <div className="photo-cell" key={p.id} style={{ position: 'relative', overflow: 'hidden' }}>
                {p.url ? (
                  <img
                    src={p.url} alt={p[titleFld]}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="photo-num">{String(i + 1).padStart(2, '0')}</div>
                )}
                <div className="photo-hover">
                  <div className="photo-hover-title">{p[titleFld]}</div>
                  <div className="photo-hover-cat">{p[catField]}</div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#aaa', fontSize: '0.82rem' }}>
                {lang === 'ar' ? 'لا توجد صور بعد.' : 'No photos yet.'}
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'videos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24, padding: '32px 40px' }}>
          {videos.map((v) => (
            <div key={v.id} style={{ border: '1px solid var(--rule)', background: '#fff' }}>
              {v.embed_url ? (
                <iframe
                  src={v.embed_url} title={v[titleFld]}
                  style={{ width: '100%', height: 200, border: 'none', display: 'block' }}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
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
    </div>
  )
}
