'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, ArrowRight, Search, BookOpen } from 'lucide-react'
import ArticleModal from './ArticleModal'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  featured: boolean
  readTime: string
  createdAt: string
}

const categoryLabels: Record<string, string> = {
  pidana: 'Hukum Pidana',
  perdata: 'Hukum Perdata',
  keluarga: 'Hukum Keluarga',
  bisnis: 'Hukum Bisnis',
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => { fetchArticles() }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      const result = await response.json()
      if (result.success) setArticles(result.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openArticle = (id: string) => {
    setSelectedArticleId(id)
    setIsModalOpen(true)
  }

  const closeArticle = () => {
    setIsModalOpen(false)
    setSelectedArticleId(null)
  }

  const categories = [
    { id: 'all', label: 'Semua' },
    ...Object.entries(categoryLabels).map(([id, label]) => ({ id, label })),
  ]

  const filteredArticles = articles.filter((a) => {
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredArticles = articles.filter((a) => a.featured)

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-amber-400 text-xs sm:text-sm font-medium tracking-widest uppercase mb-4 sm:mb-6">
              Artikel Hukum
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Edukasi Hukum
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                untuk Anda
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed">
              Temukan berbagai artikel informatif untuk membantu memahami hukum.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-2">Pilihan Editor</p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Artikel Terpopuler</h2>
          </div>
          {loading ? <div className="text-center py-12 text-slate-400">Memuat...</div> : featuredArticles.length === 0 ? (
            <div className="text-center py-12 text-slate-400">Tidak ada artikel unggulan</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="group border-0 bg-slate-50 hover:shadow-xl transition-all cursor-pointer overflow-hidden" onClick={() => openArticle(article.id)}>
                  <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-amber-400" />
                  </div>
                  <CardHeader className="p-4 sm:p-5 lg:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] sm:text-xs">
                        {categoryLabels[article.category] || article.category}
                      </Badge>
                      <span className="text-slate-400 text-[10px] sm:text-xs">{article.readTime}</span>
                    </div>
                    <CardTitle className="text-sm sm:text-base lg:text-xl group-hover:text-amber-600 transition-colors">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1 sm:mt-2 text-xs sm:text-sm">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{article.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(article.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Articles */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text" placeholder="Cari artikel..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-amber-500/50 text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 text-xs sm:text-sm ${selectedCategory === cat.id ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {loading ? <div className="text-center py-12 text-slate-400">Memuat...</div> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                <Card key={article.id} className="group border-0 bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openArticle(article.id)}>
                  <CardHeader className="p-3 sm:p-4 lg:p-5">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Badge variant="outline" className="border-amber-200 text-amber-700 text-[10px] sm:text-xs">
                        {categoryLabels[article.category] || article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm sm:text-base group-hover:text-amber-600 transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs sm:text-sm">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 lg:p-5 pt-0">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(article.createdAt)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                    </div>
                    <Button variant="ghost" className="w-full group-hover:bg-amber-50 group-hover:text-amber-600 text-xs sm:text-sm" onClick={(e) => { e.stopPropagation(); openArticle(article.id) }}>
                      Baca <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500 text-sm">Tidak ada artikel ditemukan.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">Berlangganan Newsletter</h2>
          <p className="text-slate-400 text-sm sm:text-base mb-6 sm:mb-8">Dapatkan artikel hukum terbaru langsung ke email Anda.</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="Masukkan email Anda" className="flex-1 px-4 py-2.5 sm:py-3 border-0 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm" />
            <Button className="bg-amber-500 hover:bg-amber-600 px-6 text-sm">
              Berlangganan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Article Modal */}
      <ArticleModal
        articleId={selectedArticleId}
        isOpen={isModalOpen}
        onClose={closeArticle}
      />
    </div>
  )
}
