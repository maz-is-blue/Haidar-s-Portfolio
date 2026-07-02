import { useState, useEffect } from 'react'
import {
  adminGetWorkReports, adminCreateWorkReport,
  adminUpdateWorkReport, adminDeleteWorkReport,
} from '../../services/api.js'

const EMPTY = { src: '', title_en: '', title_ar: '', desc_en: '', desc_ar: '', link: '', link_label_en: '', link_label_ar: '', cover_image: null }

function ReportModal({ item, onSave, onClose }) {
  const isEdit = Boolean(item?.id)
  const [form, setForm] = useState({ ...EMPTY, ...item, cover_image: null })
  const [preview, setPreview] = useState(item?.cover_image_url || null)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (k !== 'cover_image' && v !== null) fd.append(k, v) })
    if (form.cover_image) fd.append('cover_image', form.cover_image)
    try {
      if (isEdit) { fd.append('_method', 'PUT'); await adminUpdateWorkReport(item.id, fd) }
      else await adminCreateWorkReport(fd)
      onSave()
    } catch { alert('Failed to save.') }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-box modal-box-lg" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-header">
          <strong>{isEdit ? 'Edit Work Report' : 'New Work Report'}</strong>
          <button type="button" className="btn-admin-icon" onClick={onClose}>✕</button>
        </div>
        <div className="admin-form-grid" style={{ padding: '20px' }}>
          <div className="admin-field light">
            <label>Source / Organization</label>
            <input value={form.src} onChange={(e) => set('src', e.target.value)} placeholder="Reuters, Viory, Xinhua…" />
          </div>
          <div className="admin-field light">
            <label>External Link URL</label>
            <input value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="https://…" />
          </div>
          <div className="admin-field light">
            <label>Title (EN)</label>
            <input value={form.title_en} onChange={(e) => set('title_en', e.target.value)} placeholder="Report title in English" />
          </div>
          <div className="admin-field light">
            <label>العنوان (عربي)</label>
            <input value={form.title_ar} onChange={(e) => set('title_ar', e.target.value)} placeholder="عنوان التقرير بالعربية" />
          </div>
          <div className="admin-field light full-width">
            <label>Description (EN)</label>
            <textarea rows={3} value={form.desc_en} onChange={(e) => set('desc_en', e.target.value)} placeholder="Short description…" />
          </div>
          <div className="admin-field light full-width" dir="rtl">
            <label>الوصف (عربي)</label>
            <textarea rows={3} value={form.desc_ar} onChange={(e) => set('desc_ar', e.target.value)} placeholder="وصف قصير…" />
          </div>
          <div className="admin-field light">
            <label>Link Label (EN)</label>
            <input value={form.link_label_en} onChange={(e) => set('link_label_en', e.target.value)} placeholder="Read Report / Watch Report" />
          </div>
          <div className="admin-field light">
            <label>نص الرابط (عربي)</label>
            <input value={form.link_label_ar} onChange={(e) => set('link_label_ar', e.target.value)} placeholder="قراءة التقرير / مشاهدة التقرير" />
          </div>
          <div className="admin-field light full-width">
            <label>Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { set('cover_image', f); setPreview(URL.createObjectURL(f)) } }} />
            {preview && <img src={preview} alt="" className="img-preview" />}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
          <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Report'}</button>
          <button type="button" className="btn-admin-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default function WorkManager() {
  const [reports, setReports] = useState([])
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetWorkReports().then((r) => setReports(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])
  const del = async (id) => { if (confirm('Delete this report?')) { await adminDeleteWorkReport(id); load() } }

  return (
    <>
      {modal !== null && <ReportModal item={modal} onSave={() => { setModal(null); load() }} onClose={() => setModal(null)} />}
      <div className="admin-topbar">
        <h1>Work Reports</h1>
        <div className="admin-topbar-right">
          <button className="btn-admin-primary" onClick={() => setModal({})}>+ New Report</button>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card" style={{ padding: 0 }}>
          {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Loading…</div>
            : reports.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">◈</div><p>No work reports yet.</p></div>
              : (
                <table className="admin-table">
                  <thead><tr><th>Source</th><th>Title (EN)</th><th>Title (AR)</th><th>Actions</th></tr></thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id}>
                        <td>{r.src}</td>
                        <td style={{ maxWidth: 250 }}>{r.title_en}</td>
                        <td style={{ maxWidth: 200, direction: 'rtl' }}>{r.title_ar}</td>
                        <td><div className="td-actions">
                          <button className="btn-admin-secondary" onClick={() => setModal(r)}>Edit</button>
                          <button className="btn-admin-danger" onClick={() => del(r.id)}>Delete</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
        </div>
      </div>
    </>
  )
}
