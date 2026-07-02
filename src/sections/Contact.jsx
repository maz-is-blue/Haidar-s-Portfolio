import { useState } from 'react'
import { useLanguage } from '../LanguageContext.jsx'
import { submitContact, getSettings } from '../services/api.js'

export default function Contact() {
  const { t, lang } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', org: '', msg: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await submitContact({ name: form.name, email: form.email, org: form.org, message: form.msg })
      setSent(true)
    } catch {
      setError(lang === 'ar' ? 'فشل الإرسال. حاول مرة أخرى.' : 'Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-hdr">
        <div className="page-hdr-inner">
          <div className="page-title">{t.contact.title}</div>
          <div className="page-sub">{t.contact.sub}</div>
        </div>
      </div>

      <div className="contact-grid">
        <div className="contact-l">
          <div className="contact-headline">
            {t.contact.headline1}
            {t.contact.headline2 && <br />}
            {t.contact.headline2}
            <br />
            <span>{t.contact.headline3}</span>
          </div>

          <ul className="contact-list">
            {t.contact.info.map((item, i) => (
              <li key={i}>
                <strong>{item.label}</strong>
                {item.value}
              </li>
            ))}
          </ul>

          <div className="section-label" style={{ marginBottom: 14 }}>
            <span className="section-label-text" style={{ color: 'var(--olive-pale)' }}>
              {t.contact.availLabel}
            </span>
            <div className="section-label-line" style={{ background: '#2A2A22' }}></div>
          </div>
          <div className="avail-wrap">
            {t.contact.avail.map((a, i) => (
              <span className="avail-tag" key={i}>{a}</span>
            ))}
          </div>
        </div>

        <div className="contact-r">
          <div className="section-label" style={{ marginBottom: 24 }}>
            <span className="section-label-text">{t.contact.formLabel}</span>
            <div className="section-label-line"></div>
          </div>

          {sent ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>✓</div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--ink2)' }}>
                {lang === 'ar' ? 'تم إرسال رسالتك بنجاح.' : 'Your message has been sent.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div style={{ color: '#c0392b', fontSize: '0.78rem', marginBottom: 16 }}>{error}</div>}
              <div className="form-g">
                <label className="form-lbl">{t.contact.labels.name}</label>
                <input type="text" className="f-input" placeholder={t.contact.placeholders.name} value={form.name} onChange={handleChange('name')} required />
              </div>
              <div className="form-g">
                <label className="form-lbl">{t.contact.labels.email}</label>
                <input type="email" className="f-input" placeholder={t.contact.placeholders.email} value={form.email} onChange={handleChange('email')} required />
              </div>
              <div className="form-g">
                <label className="form-lbl">{t.contact.labels.org}</label>
                <input type="text" className="f-input" placeholder={t.contact.placeholders.org} value={form.org} onChange={handleChange('org')} />
              </div>
              <div className="form-g">
                <label className="form-lbl">{t.contact.labels.msg}</label>
                <textarea className="f-area" placeholder={t.contact.placeholders.msg} value={form.msg} onChange={handleChange('msg')} required />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '…' : t.contact.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
