import { useState, useEffect } from 'react'
import {
  adminGetPhotos, adminCreatePhoto, adminUpdatePhoto, adminDeletePhoto,
  adminGetVideos, adminCreateVideo, adminUpdateVideo, adminDeleteVideo,
} from '../../services/api.js'

const PHOTO_CATS_EN = ['Politics', 'Conflict', 'Humanitarian', 'Daily Life', 'Breaking News']
const PHOTO_CATS_AR = ['سياسة', 'نزاعات', 'إنسانية', 'حياة يومية', 'أخبار عاجلة']

function PhotoModal({ item, onSave, onClose }) {
  const isEdit = Boolean(item?.id)
  const [form, setForm] = useState({
    cat_en: item?.cat_en || 'Politics',
    cat_ar: item?.cat_ar || 'سياسة',
    title_en: item?.title_en || '',
    title_ar: item?.title_ar || '',
    file: null,
  })
  const [preview, setPreview] = useState(item?.url || null)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    set('file', f)
    setPreview(URL.createObjectURL(f))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    fd.append('cat_en', form.cat_en)
    fd.append('cat_ar', form.cat_ar)
    fd.append('title_en', form.title_en)
    fd.append('title_ar', form.title_ar)
    if (form.file) fd.append('photo', form.file)
    try {
      if (isEdit) { fd.append('_method', 'PUT'); await adminUpdatePhoto(item.id, fd) }
      else await adminCreatePhoto(fd)
      onSave()
    } catch { alert('Failed to save.') }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-box" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-header">
          <strong>{isEdit ? 'Edit Photo' : 'Upload Photo'}</strong>
          <button type="button" className="btn-admin-icon" onClick={onClose}>✕</button>
        </div>
        <div className="admin-form-grid" style={{ padding: '20px' }}>
          <div className="admin-field light">
            <label>Category (EN)</label>
            <select value={form.cat_en} onChange={(e) => set('cat_en', e.target.value)}>
              {PHOTO_CATS_EN.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field light">
            <label>التصنيف (عربي)</label>
            <select value={form.cat_ar} onChange={(e) => set('cat_ar', e.target.value)}>
              {PHOTO_CATS_AR.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field light">
            <label>Title (EN)</label>
            <input value={form.title_en} onChange={(e) => set('title_en', e.target.value)} placeholder="Caption in English" />
          </div>
          <div className="admin-field light">
            <label>العنوان (عربي)</label>
            <input value={form.title_ar} onChange={(e) => set('title_ar', e.target.value)} placeholder="التسمية بالعربية" />
          </div>
          <div className="admin-field light full-width">
            <label>Photo File</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {preview && <img src={preview} alt="" className="img-preview" />}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
          <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Photo'}</button>
          <button type="button" className="btn-admin-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

function VideoModal({ item, onSave, onClose }) {
  const isEdit = Boolean(item?.id)
  const [form, setForm] = useState({
    title_en: item?.title_en || '',
    title_ar: item?.title_ar || '',
    embed_url: item?.embed_url || '',
    file: null,
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    fd.append('title_en', form.title_en)
    fd.append('title_ar', form.title_ar)
    fd.append('embed_url', form.embed_url)
    if (form.file) fd.append('video', form.file)
    try {
      if (isEdit) { fd.append('_method', 'PUT'); await adminUpdateVideo(item.id, fd) }
      else await adminCreateVideo(fd)
      onSave()
    } catch { alert('Failed to save.') }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-box" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-header">
          <strong>{isEdit ? 'Edit Video' : 'Add Video'}</strong>
          <button type="button" className="btn-admin-icon" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-field light">
            <label>Title (EN)</label>
            <input value={form.title_en} onChange={(e) => set('title_en', e.target.value)} placeholder="Video title" />
          </div>
          <div className="admin-field light">
            <label>العنوان (عربي)</label>
            <input value={form.title_ar} onChange={(e) => set('title_ar', e.target.value)} placeholder="عنوان الفيديو" />
          </div>
          <div className="admin-field light">
            <label>Embed URL (YouTube / Vimeo / direct)</label>
            <input value={form.embed_url} onChange={(e) => set('embed_url', e.target.value)} placeholder="https://youtube.com/embed/…" />
            <div className="admin-hint">Use YouTube embed URL, or leave blank to upload a file below</div>
          </div>
          <div className="admin-field light">
            <label>Upload Video File (optional if embed URL set)</label>
            <input type="file" accept="video/*" onChange={(e) => set('file', e.target.files[0])} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
          <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Video'}</button>
          <button type="button" className="btn-admin-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default function GalleryManager() {
  const [tab, setTab] = useState('photos')
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [photoModal, setPhotoModal] = useState(null) // null = closed, {} = new, {id,…} = edit
  const [videoModal, setVideoModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const [p, v] = await Promise.all([adminGetPhotos(), adminGetVideos()])
    setPhotos(p.data)
    setVideos(v.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const delPhoto = async (id) => { if (confirm('Delete photo?')) { await adminDeletePhoto(id); load() } }
  const delVideo = async (id) => { if (confirm('Delete video?')) { await adminDeleteVideo(id); load() } }

  return (
    <>
      {photoModal !== null && (
        <PhotoModal item={photoModal} onSave={() => { setPhotoModal(null); load() }} onClose={() => setPhotoModal(null)} />
      )}
      {videoModal !== null && (
        <VideoModal item={videoModal} onSave={() => { setVideoModal(null); load() }} onClose={() => setVideoModal(null)} />
      )}

      <div className="admin-topbar">
        <h1>Gallery</h1>
        <div className="admin-topbar-right">
          {tab === 'photos'
            ? <button className="btn-admin-primary" onClick={() => setPhotoModal({})}>+ Upload Photo</button>
            : <button className="btn-admin-primary" onClick={() => setVideoModal({})}>+ Add Video</button>
          }
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'photos' ? 'active' : ''}`} onClick={() => setTab('photos')}>
            Photos ({photos.length})
          </button>
          <button className={`admin-tab ${tab === 'videos' ? 'active' : ''}`} onClick={() => setTab('videos')}>
            Videos ({videos.length})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa', fontSize: '0.8rem' }}>Loading…</div>
        ) : tab === 'photos' ? (
          photos.length === 0 ? (
            <div className="admin-empty"><div className="admin-empty-icon">◫</div><p>No photos yet.</p></div>
          ) : (
            <div className="gallery-grid">
              {photos.map((p) => (
                <div key={p.id} className="gallery-card">
                  <img src={p.url} alt={p.title_en} onError={(e) => { e.target.style.background = '#eee' }} />
                  <div className="gallery-card-body">
                    <div className="gallery-card-title">{p.title_en}</div>
                    <div className="gallery-card-cat">{p.cat_en}</div>
                    <div className="gallery-card-actions">
                      <button className="btn-admin-secondary" style={{ padding: '5px 10px', fontSize: '0.68rem' }} onClick={() => setPhotoModal(p)}>Edit</button>
                      <button className="btn-admin-danger" style={{ padding: '5px 10px' }} onClick={() => delPhoto(p.id)}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          videos.length === 0 ? (
            <div className="admin-empty"><div className="admin-empty-icon">▷</div><p>No videos yet.</p></div>
          ) : (
            <div className="gallery-grid">
              {videos.map((v) => (
                <div key={v.id} className="gallery-card">
                  {v.embed_url ? (
                    <div style={{ height: 140, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem' }}>▷</div>
                  ) : v.url ? (
                    <video src={v.url} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: 140, background: '#f0ede8' }} />
                  )}
                  <div className="gallery-card-body">
                    <div className="gallery-card-title">{v.title_en}</div>
                    <div className="gallery-card-cat">{v.embed_url ? 'Embed' : 'Uploaded'}</div>
                    <div className="gallery-card-actions">
                      <button className="btn-admin-secondary" style={{ padding: '5px 10px', fontSize: '0.68rem' }} onClick={() => setVideoModal(v)}>Edit</button>
                      <button className="btn-admin-danger" style={{ padding: '5px 10px' }} onClick={() => delVideo(v.id)}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </>
  )
}
