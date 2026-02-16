'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag,
  Search,
  BookOpen,
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

const categories = [
  { id: 'all', label: 'Semua' },
  { id: 'pidana', label: 'Hukum Pidana' },
  { id: 'perdata', label: 'Hukum Perdata' },
  { id: 'keluarga', label: 'Hukum Keluarga' },
  { id: 'bisnis', label: 'Hukum Bisnis' },
]

const articles = [
  {
    id: 1,
    title: 'Memahami Hak-Hak Tersangka dalam Proses Hukum Pidana',
    excerpt: 'Setiap orang yang menjadi tersangka dalam kasus pidana memiliki hak-hak yang dijamin oleh undang-undang. Artikel ini membahas secara lengkap hak-hak tersebut.',
    category: 'pidana',
    author: 'Dr. H. Malahayati, S.H., M.H.',
    date: '15 Januari 2025',
    readTime: '8 menit',
    featured: true,
  },
  {
    id: 2,
    title: 'Panduan Lengkap Proses Perceraian di Indonesia',
    excerpt: 'Proses perceraian bisa menjadi pengalaman yang sulit. Artikel ini memberikan panduan lengkap mengenai prosedur dan persyaratan perceraian.',
    category: 'keluarga',
    author: 'Dewi Sartika, S.H., M.Kn.',
    date: '12 Januari 2025',
    readTime: '10 menit',
    featured: true,
  },
  {
    id: 3,
    title: 'Tips Membuat Kontrak Kerja yang Melindungi Keduabelah Pihak',
    excerpt: 'Kontrak kerja yang baik harus melindungi kepentingan pekerja dan pengusaha. Berikut tips menyusun kontrak kerja yang adil.',
    category: 'bisnis',
    author: 'Andi Wijaya, S.H., LL.M.',
    date: '10 Januari 2025',
    readTime: '6 menit',
    featured: false,
  },
  {
    id: 4,
    title: 'Sengketa Tanah: Cara Mengatasinya Secara Hukum',
    excerpt: 'Sengketa tanah merupakan salah satu kasus perdata yang paling umum. Pelajari cara menyelesaikan sengketa tanah secara efektif.',
    category: 'perdata',
    author: 'Rizki Pratama, S.H., M.H.',
    date: '8 Januari 2025',
    readTime: '7 menit',
    featured: false,
  },
  {
    id: 5,
    title: 'Pentingnya Legalitas dalam Pendirian Usaha',
    excerpt: 'Banyak pengusaha yang mengabaikan aspek legalitas saat mendirikan usaha. Padahal, legalitas yang baik dapat mencegah masalah di kemudian hari.',
    category: 'bisnis',
    author: 'Andi Wijaya, S.H., LL.M.',
    date: '5 Januari 2025',
    readTime: '5 menit',
    featured: false,
  },
  {
    id: 6,
    title: 'Hak Waris dalam Hukum Islam dan Hukum Perdata',
    excerpt: 'Pembagian waris seringkali menjadi sumber konflik keluarga. Pahami perbedaan aturan waris dalam hukum Islam dan perdata.',
    category: 'keluarga',
    author: 'Dewi Sartika, S.H., M.Kn.',
    date: '3 Januari 2025',
    readTime: '9 menit',
    featured: false,
  },
  {
    id: 7,
    title: 'Tata Cara Pelaporan Kriminal kepada Kepolisian',
    excerpt: 'Mengetahui cara pelaporan yang benar dapat mempermudah proses hukum. Berikut panduan lengkap tata cara pelaporan kriminal.',
    category: 'pidana',
    author: 'Dr. H. Malahayati, S.H., M.H.',
    date: '1 Januari 2025',
    readTime: '6 menit',
    featured: false,
  },
  {
    id: 8,
    title: 'Mediasi sebagai Alternatif Penyelesaian Sengketa',
    excerpt: 'Mediasi bisa menjadi solusi yang lebih cepat dan hemat dibandingkan proses pengadilan. Pelajari keuntungan mediasi dalam penyelesaian sengketa.',
    category: 'perdata',
    author: 'Rizki Pratama, S.H., M.H.',
    date: '28 Desember 2024',
    readTime: '7 menit',
    featured: false,
  },
]

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredArticles = articles.filter((article) => article.featured)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Artikel Hukum</span>
              <h1 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
                Edukasi Hukum untuk Anda
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Temukan berbagai artikel informatif tentang hukum yang dapat membantu Anda memahami aspek-aspek penting dalam penyelesaian masalah hukum.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Artikel Pilihan</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Artikel Terpopuler</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="group border-0 shadow-lg overflow-hidden cursor-pointer">
                  <div className="h-56 bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
                    <BookOpen className="h-20 w-20 text-slate-300" />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3">{categories.find((c) => c.id === article.category)?.label}</Badge>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {article.author.split(',')[0]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {article.date}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Articles */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-5xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? 'bg-slate-900 hover:bg-slate-800' : ''}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Card key={article.id} className="group border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm text-slate-500">
                          {categories.find((c) => c.id === article.category)?.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>
                      <Button variant="ghost" className="w-full group-hover:bg-slate-50">
                        Baca Selengkapnya
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500">Tidak ada artikel yang ditemukan.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Berlangganan Newsletter</h3>
                <p className="text-slate-600 mb-6">Dapatkan artikel hukum terbaru langsung ke email Anda</p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button type="submit" className="bg-slate-900 hover:bg-slate-800 px-8">
                    Berlangganan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
