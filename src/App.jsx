import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LanguageProvider, useLanguage } from './LanguageContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Nav from './components/Nav.jsx'
import Home from './sections/Home.jsx'
import Work from './sections/Work.jsx'
import Experience from './sections/Experience.jsx'
import Photography from './sections/Photography.jsx'
import Articles from './sections/Articles.jsx'
import About from './sections/About.jsx'
import Contact from './sections/Contact.jsx'
import Footer from './components/Footer.jsx'

import AdminLogin from './admin/Login.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import Dashboard from './admin/Dashboard.jsx'
import ArticlesList from './admin/articles/ArticlesList.jsx'
import ArticleForm from './admin/articles/ArticleForm.jsx'
import GalleryManager from './admin/gallery/GalleryManager.jsx'
import WorkManager from './admin/work/WorkManager.jsx'
import CoverageManager from './admin/coverage/CoverageManager.jsx'
import ExperienceManager from './admin/experience/ExperienceManager.jsx'
import AboutManager from './admin/about/AboutManager.jsx'
import SettingsManager from './admin/settings/SettingsManager.jsx'
import MessagesManager from './admin/messages/MessagesManager.jsx'

import './App.css'
import './admin/admin.css'

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="admin-loading">Loading…</div>
  if (!admin) return <Navigate to="/admin/login" state={{ from: location }} replace />
  return children
}

function Portfolio() {
  const [page, setPage] = useState('home')
  const { t } = useLanguage()

  const pages = {
    home: <Home goTo={setPage} />,
    work: <Work />,
    exp: <Experience />,
    photos: <Photography />,
    articles: <Articles />,
    about: <About />,
    contact: <Contact />,
  }

  return (
    <div id="site-root" dir={t.dir}>
      <Nav page={page} setPage={setPage} />
      {pages[page]}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            {/* Public portfolio */}
            <Route path="/*" element={<Portfolio />} />

            {/* Admin auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin dashboard (protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<ArticlesList />} />
              <Route path="articles/new" element={<ArticleForm />} />
              <Route path="articles/:id" element={<ArticleForm />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="work" element={<WorkManager />} />
              <Route path="coverage" element={<CoverageManager />} />
              <Route path="experience" element={<ExperienceManager />} />
              <Route path="about" element={<AboutManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="messages" element={<MessagesManager />} />
            </Route>
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
