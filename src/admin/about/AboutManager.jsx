import { useState, useEffect } from 'react'
import { adminGetAbout, adminUpdateAbout, adminGetCerts, adminCreateCert, adminUpdateCert, adminDeleteCert } from '../../services/api.js'

function BulletsBuilder({ bullets, onChange, lang = 'en' }) {
  const add = () => onChange([...bullets, ''])
  const update = (i, v) => onChange(bullets.map((b, idx) => idx === i ? v : b))
  const remove = (i) => onChange(bullets.filter((_, idx) => idx !== i))
  return (
    <div>
      <div className="bullets-builder">
        {bullets.map((b, i) => (
          <div className="bullet-row" key={i}>
            <input value={b} onChange={(e) => update(i, e.target.value)} placeholder={lang === 'ar' ? 'مهارة…' : 'Skill or paragraph…'} />
            <button type="button" className="bullet-row-del" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
      </div>
      <button type="button" className="bullets-add-btn" onClick={add}>+ Add</button>
    </div>
  )
}

export default function AboutManager() {
  const [about, setAbout] = useState({ bio_en: [], bio_ar: [], skills_en: [], skills_ar: [], portrait_image: null })
  const [certs, setCerts] = useState([])
  const [tab, setTab] = useState('content')
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)

  const load = () => {
    adminGetAbout().then((r) => {
      const d = r.data
      setAbout({
        bio_en: d.bio_en || [],
        bio_ar: d.bio_ar || [],
        skills_en: d.skills_en || [],
        skills_ar: d.skills_ar || [],
        portrait_image: null,
      })
      if (d.portrait_url) setPreview(d.portrait_url)
    })
    adminGetCerts().then((r) => setCerts(r.data))
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setAbout((a) => ({ ...a, [k]: v }))

  const saveAbout = async (e) => {
    e.preventDefault(); setSaving(true); setAlert(null)
    const fd = new FormData()
    fd.append('bio_en', JSON.stringify(about.bio_en))
    fd.append('bio_ar', JSON.stringify(about.bio_ar))
    fd.append('skills_en', JSON.stringify(about.skills_en))
    fd.append('skills_ar', JSON.stringify(about.skills_ar))
    if (about.portrait_image) fd.append('portrait', about.portrait_image)
    try {
      await adminUpdateAbout(fd)
      setAlert({ type: 'success', msg: 'About page saved.' })
    } catch { setAlert({ type: 'error', msg: 'Save failed.' }) }
    setSaving(false)
  }

  // Certifications CRUD
  const [certForm, setCertForm] = useState({ name_en: '', name_ar: '', org_en: '', org_ar: '' })
  const [certEdit, setCertEdit] = useState(null)

  const saveCert = async () => {
    if (certEdit) { await adminUpdateCert(certEdit.id, certForm); setCertEdit(null) }
    else await adminCreateCert(certForm)
    setCertForm({ name_en: '', name_ar: '', org_en: '', org_ar: '' })
    adminGetCerts().then((r) => setCerts(r.data))
  }

  const delCert = async (id) => { if (confirm('Delete?')) { await adminDeleteCert(id); adminGetCerts().then((r) => setCerts(r.data)) } }

  return (
    <>
      <div className="admin-topbar">
        <h1>About Page</h1>
      </div>
      <div className="admin-content">
        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'content' ? 'active' : ''}`} onClick={() => setTab('content')}>Bio & Skills</button>
          <button className={`admin-tab ${tab === 'certs' ? 'active' : ''}`} onClick={() => setTab('certs')}>Certifications</button>
        </div>

        {tab === 'content' && (
          <form onSubmit={saveAbout}>
            {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}
            <div className="admin-card">
              <div className="admin-card-header"><div className="admin-card-title">Portrait Photo</div></div>
              <div className="admin-field light">
                <label>Upload Portrait</label>
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { set('portrait_image', f); setPreview(URL.createObjectURL(f)) } }} />
                {preview && <img src={preview} alt="" style={{ marginTop: 10, height: 100, objectFit: 'cover', border: '1px solid #e8e6e0' }} />}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header"><div className="admin-card-title">Bio Paragraphs</div></div>
              <div className="admin-tabs" style={{ marginBottom: 16 }}>
                <button type="button" className="admin-tab active">English</button>
              </div>
              <div className="admin-field light">
                <label>Bio paragraphs (EN) — one per line</label>
                <BulletsBuilder bullets={about.bio_en} onChange={(v) => set('bio_en', v)} lang="en" />
              </div>
              <div style={{ marginTop: 20 }}>
                <div className="admin-field light" dir="rtl">
                  <label>فقرات النبذة (عربي)</label>
                  <BulletsBuilder bullets={about.bio_ar} onChange={(v) => set('bio_ar', v)} lang="ar" />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header"><div className="admin-card-title">Skills</div></div>
              <div className="admin-form-grid">
                <div className="admin-field light">
                  <label>Skills (EN)</label>
                  <BulletsBuilder bullets={about.skills_en} onChange={(v) => set('skills_en', v)} lang="en" />
                </div>
                <div className="admin-field light" dir="rtl">
                  <label>المهارات (عربي)</label>
                  <BulletsBuilder bullets={about.skills_ar} onChange={(v) => set('skills_ar', v)} lang="ar" />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving…' : 'Save About Page'}</button>
          </form>
        )}

        {tab === 'certs' && (
          <div>
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">{certEdit ? 'Edit Certification' : 'Add Certification'}</div>
              </div>
              <div className="admin-form-grid">
                <div className="admin-field light">
                  <label>Name (EN)</label>
                  <input value={certForm.name_en} onChange={(e) => setCertForm((f) => ({ ...f, name_en: e.target.value }))} placeholder="HEFAT — Hostile Environment First Aid" />
                </div>
                <div className="admin-field light">
                  <label>الاسم (عربي)</label>
                  <input value={certForm.name_ar} onChange={(e) => setCertForm((f) => ({ ...f, name_ar: e.target.value }))} placeholder="HEFAT — الإسعافات الأولية" />
                </div>
                <div className="admin-field light">
                  <label>Organization (EN)</label>
                  <input value={certForm.org_en} onChange={(e) => setCertForm((f) => ({ ...f, org_en: e.target.value }))} placeholder="AFP" />
                </div>
                <div className="admin-field light">
                  <label>المنظمة (عربي)</label>
                  <input value={certForm.org_ar} onChange={(e) => setCertForm((f) => ({ ...f, org_ar: e.target.value }))} placeholder="أ.ف.ب" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button className="btn-admin-primary" onClick={saveCert}>{certEdit ? 'Update' : '+ Add'}</button>
                {certEdit && <button className="btn-admin-secondary" onClick={() => { setCertEdit(null); setCertForm({ name_en: '', name_ar: '', org_en: '', org_ar: '' }) }}>Cancel</button>}
              </div>
            </div>

            <div className="admin-card" style={{ padding: 0 }}>
              {certs.length === 0 ? <div className="admin-empty"><p>No certifications yet.</p></div> : (
                <table className="admin-table">
                  <thead><tr><th>Name (EN)</th><th>Org</th><th>Actions</th></tr></thead>
                  <tbody>
                    {certs.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name_en}</td>
                        <td>{c.org_en}</td>
                        <td><div className="td-actions">
                          <button className="btn-admin-secondary" onClick={() => { setCertEdit(c); setCertForm(c) }}>Edit</button>
                          <button className="btn-admin-danger" onClick={() => delCert(c.id)}>Delete</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
