import { useLanguage } from '../LanguageContext.jsx'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <div className="footer">
      <div className="footer-brand">{t.footer.brand}</div>
      <div className="footer-copy">{t.footer.copy}</div>
    </div>
  )
}
