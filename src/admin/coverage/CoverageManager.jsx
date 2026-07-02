import { useState, useEffect } from 'react'
import {
  adminGetCoverages, adminCreateCoverage,
  adminUpdateCoverage, adminDeleteCoverage,
} from '../../services/api.js'

function LinksBuilder({ links, onChange }) {
  const add = () => onChange([...links, { label: '', url: '' }])
  const update = (i, k, v) => onChange(links.map((l, idx) => idx === i ? { ...l, [k]: v } : l))
  const remove = (i) => onChange(links.filter((_, idx) => idx !== i))
  return (
    <div>
      <div className="links-builder">
        {links.map((l, i) => (
          <div className="link-row" key={i}>
            <input placeholder="Label" value={l.label} onChange={(e) => update(i, 'label', e.target.value)} />
            <input placeholder="URL" value={l.url} onChange={(e) => update(i, 'url', e.target.value)} />
            <button type="button" className="link-row-del" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        {links.length === 0 && <div style={{ padding: '14px', fontSize: '0.75rem', color: '#aaa', textAlign: 'center' }}>No links yet</div>}
      </div>
      <button type="button" className="links-add-btn" onClick={add}>+ Add Link</button>
    </div>
  )
}

const EMPTY = { name_en: '', name_ar: '', year: '', desc_en: '', desc_ar: '', links: [] }

function CoverageModal({ item, onSave, onClose }) {
  const isEdit = Boolean(item?.id)
  const [form, setForm] = useState({ ...EMPTY, ...item, links: item?.links || [] })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    const payload = { ...form }
    try {
      if (isEdit) await adminUpdateCoverage(item.id, payload)
      else await adminCreateCoverage(payload)
      onSave()
    } catch { alert('Failed to save.') }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-box modal-box-lg" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-header">
          <strong>{isEdit ? 'Edit Coverage Event' : 'New Coverage Event'}</strong>
          <button type="button" className="btn-admin-icon" onClick={onClose}>✕</button>
        </div>
        <div className="admin-form-grid" style={{ padding: '20px' }}>
          <div className="admin-field light">
            <label>Event Name (EN)</label>
            <input value={form.name_en} onChange={(e) => set('name_en', e.target.value)} placeholder="Iraqi Protests" />
          </div>
          <div className="admin-field light">
            <label>اسم الحدث (عربي)</label>
            <input value={form.name_ar} onChange={(e) => set('name_ar', e.target.value)} placeholder="احتجاجات العراق" />
          </div>
          <div className="admin-field light">
            <label>Year</label>
            <input value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2019 or 2024–2025" />
          </div>
          <div className="admin-field light full-width">
            <label>Description (EN)</label>
            <textarea rows={3} value={form.desc_en} onChange={(e) => set('desc_en', e.target.value)} placeholder="Field reporting from…" />
          </div>
          <div className="admin-field light full-width" dir="rtl">
            <label>الوصف (عربي)</label>
            <textarea rows={3} value={form.desc_ar} onChange={(e) => set('desc_ar', e.target.value)} placeholder="تغطية ميدانية من…" />
          </div>
          <div className="full-width">
            <div className="admin-field light">
              <label>Links</label>
              <LinksBuilder links={form.links} onChange={(v) => set('links', v)} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
          <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Event'}</button>
          <button type="button" className="btn-admin-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default function CoverageManager() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetCoverages().then((r) => setItems(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])
  const del = async (id) => { if (confirm('Delete this coverage event?')) { await adminDeleteCoverage(id); load() } }

  return (
    <>
      {modal !== null && <CoverageModal item={modal} onSave={() => { setModal(null); load() }} onClose={() => setModal(null)} />}
      <div className="admin-topbar">
        <h1>Major Coverage</h1>
        <div className="admin-topbar-right">
          <button className="btn-admin-primary" onClick={() => setModal({})}>+ New Event</button>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card" style={{ padding: 0 }}>
          {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Loading…</div>
            : items.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">◉</div><p>No coverage events yet.</p></div>
              : (
                <table className="admin-table">
                  <thead><tr><th>Event (EN)</th><th>Year</th><th>Links</th><th>Actions</th></tr></thead>
                  <tbody>
                    {items.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name_en}</td>
                        <td>{c.year}</td>
                        <td>{c.links?.length || 0}</td>
                        <td><div className="td-actions">
                          <button className="btn-admin-secondary" onClick={() => setModal(c)}>Edit</button>
                          <button className="btn-admin-danger" onClick={() => del(c.id)}>Delete</button>
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
