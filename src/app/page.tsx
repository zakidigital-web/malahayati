'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HomePage from '@/components/pages/HomePage'
import AboutPage from '@/components/pages/AboutPage'
import ServicesPage from '@/components/pages/ServicesPage'
import ArticlesPage from '@/components/pages/ArticlesPage'
import ContactPage from '@/components/pages/ContactPage'

const validPages = ['home', 'about', 'services', 'articles', 'contact']

export default function Home() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1)
      if (hash && validPages.includes(hash)) {
        return hash
      }
    }
    return 'home'
  })

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />
      case 'services':
        return <ServicesPage />
      case 'articles':
        return <ArticlesPage />
      case 'contact':
        return <ContactPage />
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 pb-16 lg:pb-0">{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
    </div>
  )
}
