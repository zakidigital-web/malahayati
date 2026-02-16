'use client'

import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Articles from '@/components/pages/ArticlesPage'

export default function ArticlesPageRoute() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Articles />
      </main>
      <Footer onNavigate={() => {}} />
    </div>
  )
}
