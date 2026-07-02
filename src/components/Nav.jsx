import { useState } from 'react'
import { useLanguage } from '../LanguageContext.jsx'

export default function Nav({ page, setPage }) {
  const { t, toggleLang } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  const items = [
    ['home', t.nav.home],
    ['work', t.nav.work],
    ['exp', t.nav.exp],
    ['photos', t.nav.photos],
    ['articles', t.nav.articles],
    ['about', t.nav.about],
    ['contact', t.nav.contact],
  ]

  const go = (id) => {
    setPage(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="nav">
      <button className="logo" onClick={() => go('home')}>
        {t.hero.name1} <span>{t.hero.name2}</span>
      </button>

      <ul className="nav-links">
        {items.map(([id, label]) => (
          <li key={id}>
            <button className={page === id ? 'on' : ''} onClick={() => go(id)}>
              {label}
            </button>
          </li>
        ))}
      </ul>

      <button className="nav-mobile-toggle" onClick={() => setMenuOpen((o) => !o)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      <button className="lang-btn" onClick={toggleLang}>
        {t.langBtn}
      </button>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {items.map(([id, label]) => (
            <button key={id} className={page === id ? 'on' : ''} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
