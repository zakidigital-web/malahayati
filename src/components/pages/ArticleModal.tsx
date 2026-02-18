'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, X } from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  readTime: string
  createdAt: string
}

interface ArticleModalProps {
  articleId: string | null
  isOpen: boolean
  onClose: () => void
}

const categoryLabels: Record<string, string> = {
  pidana: 'Hukum Pidana',
  perdata: 'Hukum Perdata',
  keluarga: 'Hukum Keluarga',
  bisnis: 'Hukum Bisnis',
}

export default function ArticleModal({ articleId, isOpen, onClose }: ArticleModalProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (articleId && isOpen) {
      fetchArticle(articleId)
    }
  }, [articleId, isOpen])

  const fetchArticle = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/articles?id=${id}`, { cache: 'no-store' })
      const result = await response.json()
      if (result.success) {
        setArticle(result.data)
      }
    } catch (error) {
      console.error('Error fetching article:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Memuat artikel...</div>
        ) : article ? (
          <div className="mt-4">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                {categoryLabels[article.category] || article.category}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
              </div>
            </div>

            {/* Title */}
            <DialogHeader>
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-left">
                {article.title}
              </DialogTitle>
            </DialogHeader>

            {/* Author */}
            <div className="flex items-center gap-3 mt-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-slate-900">{article.author}</p>
                <p className="text-xs text-slate-500">Penulis</p>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6 border-l-4 border-amber-500">
              <p className="text-slate-700 italic">{article.excerpt}</p>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, src, ...props }) => {
                    const toDisplayUrl = (url?: string | null) => {
                      if (!url) return ''
                      try {
                        const u = new URL(url, 'https://dummy.local')
                        if (u.hostname.includes('drive.google.com')) {
                          if (u.pathname.includes('/file/d/')) {
                            const parts = u.pathname.split('/')
                            const idx = parts.findIndex(p => p === 'd')
                            if (idx >= 0 && parts[idx + 1]) return `/api/drive-image?id=${parts[idx + 1]}`
                          }
                          const idParam = u.searchParams.get('id')
                          if (idParam) return `/api/drive-image?id=${idParam}`
                        }
                        return url
                      } catch {
                        return url
                      }
                    }
                    let resolvedSrc: string | undefined
                    if (typeof src === 'string') {
                      resolvedSrc = src
                    } else if (typeof window !== 'undefined' && src instanceof Blob) {
                      resolvedSrc = URL.createObjectURL(src)
                    }
                    return <img src={toDisplayUrl(resolvedSrc ?? null)} alt={(props as any).alt ?? ''} {...props} />
                  },
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Dipublikasikan pada {formatDate(article.createdAt)}
              </div>
              <button
                onClick={onClose}
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">Artikel tidak ditemukan</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
