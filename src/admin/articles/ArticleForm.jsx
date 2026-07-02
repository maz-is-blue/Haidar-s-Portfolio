import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { adminGetArticle, adminCreateArticle, adminUpdateArticle } from '../../services/api.js'

function RichEditor({ content, onChange, placeholder = 'Write here…' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  const toolbar = [
    { label: 'B', cmd: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { label: 'I', cmd: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { label: 'H1', cmd: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { label: 'H2', cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { label: '¶', cmd: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') },
    { label: '• List', cmd: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { label: '1. List', cmd: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { label: '——', cmd: () => editor.chain().focus().setHorizontalRule().run(), active: false },
    {
      label: '🔗', active: editor.isActive('link'), cmd: () => {
        const url = prompt('URL:', editor.getAttributes('link').href || '')
        if (url) editor.chain().focus().setLink({ href: url }).run()
        else editor.chain().focus().unsetLink().run()
      }
    },
  ]

  return (
    <div className="tiptap-wrap">
      <div className="tiptap-toolbar">
        {toolbar.map((t) => (
          <button
            key={t.label} type="button"
            className={t.active ? 'is-active' : ''}
            onClick={t.cmd}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tiptap-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

function LinksBuilder({ links, onChange }) {
  const add = () => onChange([...links, { label: '', url: '' }])
  const update = (i, field, val) => {
    const next = links.map((l, idx) => (idx === i ? { ...l, [field]: val } : l))
    onChange(next)
  }
  const remove = (i) => onChange(links.filter((_, idx) => idx !== i))

  return (
    <div>
      <div className="links-builder">
        {links.map((l, i) => (
          <div className="link-row" key={i}>
            <input
              placeholder="Label (e.g. Read Article)"
              value={l.label} onChange={(e) => update(i, 'label', e.target.value)}
            />
            <input
              placeholder="URL (https://…)"
              value={l.url} onChange={(e) => update(i, 'url', e.target.value)}
            />
            <button type="button" className="link-row-del" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        {links.length === 0 && (
          <div style={{ padding: '14px', fontSize: '0.75rem', color: '#aaa', textAlign: 'center' }}>
            No links yet
          </div>
        )}
      </div>
      <button type="button" className="links-add-btn" onClick={add}>+ Add Link</button>
    </div>
  )
}

const EMPTY = {
  pub: '', title_en: '', title_ar: '',
  excerpt_en: '', excerpt_ar: '',
  content_en: '', content_ar: '',
  cover_image: null, links: [],
}

export default function ArticleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY)
  const [tab, setTab] = useState('en')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [previewSrc, setPreviewSrc] = useState(null)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    adminGetArticle(id).then((r) => {
      const d = r.data
      setForm({
        pub: d.pub || '',
        title_en: d.title_en || '', title_ar: d.title_ar || '',
        excerpt_en: d.excerpt_en || '', excerpt_ar: d.excerpt_ar || '',
        content_en: d.content_en || '', content_ar: d.content_ar || '',
        cover_image: null,
        links: d.links || [],
      })
      if (d.cover_image_url) setPreviewSrc(d.cover_image_url)
    }).finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }))

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    set('cover_image', file)
    setPreviewSrc(URL.createObjectURL(file))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setAlert(null)
    try {
      const fd = new FormData()
      fd.append('pub', form.pub)
      fd.append('title_en', form.title_en)
      fd.append('title_ar', form.title_ar)
      fd.append('excerpt_en', form.excerpt_en)
      fd.append('excerpt_ar', form.excerpt_ar)
      fd.append('content_en', form.content_en)
      fd.append('content_ar', form.content_ar)
      fd.append('links', JSON.stringify(form.links))
      if (form.cover_image) fd.append('cover_image', form.cover_image)
      if (isEdit) {
        fd.append('_method', 'PUT')
        await adminUpdateArticle(id, fd)
      } else {
        await adminCreateArticle(fd)
      }
      setAlert({ type: 'success', msg: 'Saved successfully.' })
      setTimeout(() => navigate('/admin/articles'), 800)
    } catch {
      setAlert({ type: 'error', msg: 'Failed to save. Check all fields.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Loading…</div>

  return (
    <>
      <div className="admin-topbar">
        <h1>{isEdit ? 'Edit Article' : 'New Article'}</h1>
        <div className="admin-topbar-right">
          <button className="btn-admin-secondary" onClick={() => navigate('/admin/articles')}>← Back</button>
        </div>
      </div>
      <div className="admin-content">
        {alert && (
          <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>
        )}
        <form onSubmit={submit}>
          {/* Publication */}
          <div className="admin-card">
            <div className="admin-card-header"><div className="admin-card-title">Publication Info</div></div>
            <div className="admin-form-grid">
              <div className="admin-field light">
                <label>Publication / Source</label>
                <input value={form.pub} onChange={(e) => set('pub', e.target.value)} placeholder="Raseef22, The Cradle…" />
              </div>
            </div>
          </div>

          {/* Bilingual Tabs */}
          <div className="admin-card">
            <div className="admin-tabs">
              <button type="button" className={`admin-tab ${tab === 'en' ? 'active' : ''}`} onClick={() => setTab('en')}>English</button>
              <button type="button" className={`admin-tab ${tab === 'ar' ? 'active' : ''}`} onClick={() => setTab('ar')}>العربية</button>
            </div>

            {tab === 'en' && (
              <div>
                <div className="admin-form-grid">
                  <div className="admin-field light full-width">
                    <label>Title (English)</label>
                    <input value={form.title_en} onChange={(e) => set('title_en', e.target.value)} placeholder="Article title…" />
                  </div>
                  <div className="admin-field light full-width">
                    <label>Excerpt / Summary (English)</label>
                    <textarea rows={3} value={form.excerpt_en} onChange={(e) => set('excerpt_en', e.target.value)} placeholder="Short summary shown on the listing page…" />
                  </div>
                </div>
                <div className="admin-field light" style={{ marginTop: 16 }}>
                  <label>Full Article Content (English)</label>
                  <RichEditor
                    content={form.content_en}
                    onChange={(v) => set('content_en', v)}
                    placeholder="Write the full article in English…"
                  />
                </div>
              </div>
            )}

            {tab === 'ar' && (
              <div dir="rtl">
                <div className="admin-form-grid">
                  <div className="admin-field light full-width">
                    <label>العنوان (عربي)</label>
                    <input value={form.title_ar} onChange={(e) => set('title_ar', e.target.value)} placeholder="عنوان المقال…" />
                  </div>
                  <div className="admin-field light full-width">
                    <label>المقتطف / الملخص (عربي)</label>
                    <textarea rows={3} value={form.excerpt_ar} onChange={(e) => set('excerpt_ar', e.target.value)} placeholder="ملخص قصير يظهر في صفحة القائمة…" />
                  </div>
                </div>
                <div className="admin-field light" style={{ marginTop: 16 }}>
                  <label>محتوى المقال الكامل (عربي)</label>
                  <RichEditor
                    content={form.content_ar}
                    onChange={(v) => set('content_ar', v)}
                    placeholder="اكتب المقال بالكامل بالعربية…"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="admin-card">
            <div className="admin-card-header"><div className="admin-card-title">Cover Image</div></div>
            <div className="admin-field light">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleFile} />
              {previewSrc && <img src={previewSrc} alt="" className="img-preview" />}
            </div>
          </div>

          {/* External Links */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">External Links</div>
              <span style={{ fontSize: '0.7rem', color: '#888' }}>Add multiple links (e.g. Read Article, Watch Report, Archive)</span>
            </div>
            <LinksBuilder links={form.links} onChange={(v) => set('links', v)} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-admin-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Article'}
            </button>
            <button type="button" className="btn-admin-secondary" onClick={() => navigate('/admin/articles')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
