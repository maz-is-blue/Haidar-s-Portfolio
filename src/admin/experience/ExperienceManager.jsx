import { useState, useEffect } from 'react'
import {
  adminGetExperiences, adminCreateExperience,
  adminUpdateExperience, adminDeleteExperience,
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

function BulletsBuilder({ bullets, onChange, lang = 'en' }) {
  const add = () => onChange([...bullets, ''])
  const update = (i, v) => onChange(bullets.map((b, idx) => idx === i ? v : b))
  const remove = (i) => onChange(bullets.filter((_, idx) => idx !== i))
  return (
    <div>
      <div className="bullets-builder">
        {bullets.map((b, i) => (
          <div className="bullet-row" key={i}>
            <input value={b} onChange={(e) => update(i, e.target.value)} placeholder={lang === 'ar' ? 'نقطة…' : 'Bullet point…'} />
            <button type="button" className="bullet-row-del" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        {bullets.length === 0 && <div style={{ padding: '14px', fontSize: '0.75rem', color: '#aaa', textAlign: 'center' }}>No bullets yet</div>}
      </div>
      <button type="button" className="bullets-add-btn" onClick={add}>+ Add Bullet</button>
    </div>
  )
}

const EMPTY = { years: '', org: '', role_en: '', role_ar: '', bullets_en: [], bullets_ar: [], links: [] }

function ExperienceModal({ item, onSave, onClose }) {
  const isEdit = Boolean(item?.id)
  const [form, setForm] = useState({
    ...EMPTY, ...item,
    bullets_en: item?.bullets_en || [],
    bullets_ar: item?.bullets_ar || [],
    links: item?.links || [],
  })
  const [tab, setTab] = useState('en')
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (isEdit) await adminUpdateExperience(item.id, form)
      else await adminCreateExperience(form)
      onSave()
    } catch { alert('Failed to save.') }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-box modal-box-lg" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-header">
          <strong>{isEdit ? 'Edit Experience' : 'New Experience'}</strong>
          <button type="button" className="btn-admin-icon" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="admin-form-grid" style={{ marginBottom: 20 }}>
            <div className="admin-field light">
              <label>Years</label>
              <input value={form.years} onChange={(e) => set('years', e.target.value)} placeholder="2019 — Present" />
            </div>
            <div className="admin-field light">
              <label>Organization</label>
              <input value={form.org} onChange={(e) => set('org', e.target.value)} placeholder="Reuters · AFP · Xinhua" />
            </div>
          </div>

          <div className="admin-tabs">
            <button type="button" className={`admin-tab ${tab === 'en' ? 'active' : ''}`} onClick={() => setTab('en')}>English</button>
            <button type="button" className={`admin-tab ${tab === 'ar' ? 'active' : ''}`} onClick={() => setTab('ar')}>العربية</button>
          </div>

          {tab === 'en' && (
            <div>
              <div className="admin-field light" style={{ marginBottom: 16 }}>
                <label>Role (EN)</label>
                <input value={form.role_en} onChange={(e) => set('role_en', e.target.value)} placeholder="Field Correspondent" />
              </div>
              <div className="admin-field light">
                <label>Bullet Points (EN)</label>
                <BulletsBuilder bullets={form.bullets_en} onChange={(v) => set('bullets_en', v)} lang="en" />
              </div>
            </div>
          )}

          {tab === 'ar' && (
            <div dir="rtl">
              <div className="admin-field light" style={{ marginBottom: 16 }}>
                <label>الدور (عربي)</label>
                <input value={form.role_ar} onChange={(e) => set('role_ar', e.target.value)} placeholder="مراسل ميداني" />
              </div>
              <div className="admin-field light">
                <label>النقاط (عربي)</label>
                <BulletsBuilder bullets={form.bullets_ar} onChange={(v) => set('bullets_ar', v)} lang="ar" />
              </div>
            </div>
          )}

          <div className="admin-field light" style={{ marginTop: 20 }}>
            <label>Links</label>
            <LinksBuilder links={form.links} onChange={(v) => set('links', v)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
          <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className="btn-admin-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default function ExperienceManager() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => adminGetExperiences().then((r) => setItems(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])
  const del = async (id) => { if (confirm('Delete this experience entry?')) { await adminDeleteExperience(id); load() } }

  return (
    <>
      {modal !== null && <ExperienceModal item={modal} onSave={() => { setModal(null); load() }} onClose={() => setModal(null)} />}
      <div className="admin-topbar">
        <h1>Experience</h1>
        <div className="admin-topbar-right">
          <button className="btn-admin-primary" onClick={() => setModal({})}>+ Add Entry</button>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-card" style={{ padding: 0 }}>
          {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Loading…</div>
            : items.length === 0 ? <div className="admin-empty"><div className="admin-empty-icon">◷</div><p>No experience entries yet.</p></div>
              : (
                <table className="admin-table">
                  <thead><tr><th>Years</th><th>Organization</th><th>Role (EN)</th><th>Links</th><th>Actions</th></tr></thead>
                  <tbody>
                    {items.map((x) => (
                      <tr key={x.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{x.years}</td>
                        <td>{x.org}</td>
                        <td>{x.role_en}</td>
                        <td>{x.links?.length || 0}</td>
                        <td><div className="td-actions">
                          <button className="btn-admin-secondary" onClick={() => setModal(x)}>Edit</button>
                          <button className="btn-admin-danger" onClick={() => del(x.id)}>Delete</button>
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
