import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Yachts } from './pages/Yachts'
import { YachtDetails } from './pages/YachtDetails'
import { Locations } from './pages/Locations'
import { LocationDetails } from './pages/LocationDetails'
import { Articles } from './pages/Articles'
import { ArticleDetails } from './pages/ArticleDetails'
import { AdminDashboard } from './pages/AdminDashboard'
import './App.css'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  const handleAdminLogin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus)
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
  }

  if (isAdmin) {
    return (
      <LanguageProvider>
        <AdminDashboard onLogout={handleAdminLogout} />
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header onAdminLogin={handleAdminLogin} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/yachts" element={<Yachts />} />
              <Route path="/yachts/:id" element={<YachtDetails />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/locations/:id" element={<LocationDetails />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetails />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
