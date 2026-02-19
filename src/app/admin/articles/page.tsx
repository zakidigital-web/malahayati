'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Plus, Search, Edit, Trash2, Eye, Star, FileText } from 'lucide-react'
import '@mdxeditor/editor/style.css'
import { MDXEditor, toolbarPlugin, listsPlugin, linkPlugin, imagePlugin, quotePlugin, headingsPlugin, markdownShortcutPlugin } from '@mdxeditor/editor'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  featured: boolean
  published: boolean
  readTime: string
  imageUrl?: string
  createdAt: string
}

const categories = [
  { value: 'pidana', label: 'Hukum Pidana' },
  { value: 'perdata', label: 'Hukum Perdata' },
  { value: 'keluarga', label: 'Hukum Keluarga' },
  { value: 'bisnis', label: 'Hukum Bisnis' },
]

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', category: '', author: '', imageUrl: '',
    featured: false, published: true, readTime: '5 menit'
  })
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingContentImage, setUploadingContentImage] = useState(false)

  useEffect(() => { fetchArticles() }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/articles')
      const result = await response.json()
      if (result.success) setArticles(result.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => 
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === 'title') setFormData(prev => ({ ...prev, slug: generateSlug(value as string) }))
  }

  const openCreateDialog = () => {
    setEditingArticle(null)
    setFormData({ title: '', slug: '', excerpt: '', content: '', category: '', author: '', imageUrl: '', featured: false, published: true, readTime: '5 menit' })
    setIsDialogOpen(true)
  }

  const openEditDialog = (article: Article) => {
    setEditingArticle(article)
    setFormData({ title: article.title, slug: article.slug, excerpt: article.excerpt, content: article.content, category: article.category, author: article.author, imageUrl: article.imageUrl || '', featured: article.featured, published: article.published, readTime: article.readTime })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const method = editingArticle ? 'PUT' : 'POST'
      const body = editingArticle ? { ...formData, id: editingArticle.id } : formData
      const response = await fetch('/api/admin/articles', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!', description: editingArticle ? 'Artikel diperbarui' : 'Artikel dibuat' })
        setIsDialogOpen(false)
        fetchArticles()
      } else throw new Error(result.error)
    } catch (error) {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return
    try {
      const response = await fetch(`/api/admin/articles?id=${id}`, { method: 'DELETE' })
      if ((await response.json()).success) {
        toast({ title: 'Berhasil!', description: 'Artikel dihapus' })
        fetchArticles()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  const toggleFeatured = async (article: Article) => {
    try {
      const response = await fetch('/api/admin/articles', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: article.id, featured: !article.featured }) })
      if ((await response.json()).success) {
        toast({ title: 'Berhasil!' })
        fetchArticles()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  const filteredArticles = articles.filter(a => 
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.author.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterCategory === 'all' || a.category === filterCategory)
  )

  const normalizeImageUrl = (url: string) => {
    if (!url) return url
    try {
      const u = new URL(url)
      if (u.hostname.includes('drive.google.com')) {
        if (u.pathname.includes('/file/d/')) {
          const parts = u.pathname.split('/')
          const idIndex = parts.findIndex(p => p === 'd') + 1
          const fileId = parts[idIndex]
          if (fileId) return `https://drive.google.com/uc?export=view&id=${fileId}`
        }
        const idParam = u.searchParams.get('id')
        if (idParam) return `https://drive.google.com/uc?export=view&id=${idParam}`
      }
      const segments = u.pathname.split('/').filter(Boolean)
      const candidate = segments.find(seg => /^[a-zA-Z0-9_-]{10,}$/.test(seg))
      if (candidate) return `https://drive.google.com/uc?export=view&id=${candidate}`
      return url
    } catch {
      return url
    }
  }

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

  const handleUpload = async (file: File, setUrl: (v: string) => void) => {
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'articles')
      fd.append('storage', 'blob')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json?.success && json.url) {
        const nextUrl = json.provider === 'gdrive' && json.id ? `/api/drive-image?id=${json.id}` : json.url
        setUrl(nextUrl)
        toast({ title: 'Berhasil', description: 'Gambar diunggah' })
      } else {
        throw new Error(json?.error || 'Upload gagal')
      }
    } catch {
      toast({ title: 'Gagal', description: 'Tidak dapat mengunggah gambar', variant: 'destructive' })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'URL disalin', description: 'Tempelkan URL ke konten dengan Insert Image' })
    } catch {
      toast({ title: 'Gagal menyalin', variant: 'destructive' })
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Kelola Artikel</h1>
          <p className="text-slate-500 mt-1">Buat dan kelola artikel hukum</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" /> Buat Artikel
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Cari artikel..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? <div className="text-center py-12 text-slate-400">Memuat...</div> : filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-slate-400"><FileText className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Belum ada artikel</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b bg-slate-50">
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">Judul</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-500 hidden md:table-cell">Kategori</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-500 hidden lg:table-cell">Penulis</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-slate-500 hidden sm:table-cell">Status</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-slate-500">Aksi</th>
                </tr></thead>
                <tbody>
                  {filteredArticles.map(a => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleFeatured(a)} className={`flex-shrink-0 ${a.featured ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}>
                            <Star className={`h-5 w-5 ${a.featured ? 'fill-current' : ''}`} />
                          </button>
                          <div>
                            <div className="font-medium text-slate-900">{a.title}</div>
                            <div className="text-xs text-slate-400 mt-1">{formatDate(a.createdAt)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell"><Badge variant="outline">{categories.find(c => c.value === a.category)?.label || a.category}</Badge></td>
                      <td className="py-4 px-4 hidden lg:table-cell"><span className="text-sm text-slate-600">{a.author}</span></td>
                      <td className="py-4 px-4 hidden sm:table-cell">{a.published ? <Badge className="bg-green-100 text-green-700">Published</Badge> : <Badge variant="secondary">Draft</Badge>}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(a)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingArticle ? 'Edit Artikel' : 'Buat Artikel Baru'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Judul</Label><Input placeholder="Judul artikel" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required /></div>
              <div className="space-y-2"><Label>Slug</Label><Input placeholder="url-artikel" value={formData.slug} onChange={(e) => handleInputChange('slug', e.target.value)} required /></div>
            </div>
            <div className="space-y-2"><Label>Ringkasan</Label><Textarea placeholder="Ringkasan singkat..." rows={2} value={formData.excerpt} onChange={(e) => handleInputChange('excerpt', e.target.value)} required /></div>
            <div className="space-y-2">
              <Label>Gambar Sampul (opsional)</Label>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Tempel URL gambar (mendukung Google Drive publik)"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  onBlur={(e) => {
                    const normalized = normalizeImageUrl(e.target.value.trim())
                    if (normalized !== e.target.value.trim()) {
                      handleInputChange('imageUrl', normalized)
                      toast({ title: 'URL diubah', description: 'Link Google Drive diubah ke link langsung' })
                    }
                  }}
                />
                <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setUploadingCover(true)
                  await handleUpload(file, (url) => handleInputChange('imageUrl', url))
                  setUploadingCover(false)
                  e.currentTarget.value = ''
                }} />
                <Button type="button" variant="outline" onClick={() => document.getElementById('cover-upload')?.click()} disabled={uploadingCover}>
                  {uploadingCover ? 'Mengunggah...' : 'Unggah Sampul'}
                </Button>
              </div>
              {formData.imageUrl && (
                <div className="mt-2">
                  <img src={toDisplayUrl(formData.imageUrl)} alt="Sampul" className="h-24 rounded-md object-cover border" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Konten</Label>
              <div className="rounded-md border overflow-hidden">
                <MDXEditor
                  markdown={formData.content}
                  onChange={(md) => handleInputChange('content', md)}
                  plugins={[
                    toolbarPlugin(),
                    listsPlugin(),
                    linkPlugin(),
                    imagePlugin(),
                    quotePlugin(),
                    headingsPlugin(),
                    markdownShortcutPlugin()
                  ]}
                  contentEditableClassName="prose prose-slate max-w-none p-3 sm:p-4"
                />
              </div>
              <div className="flex items-center gap-2">
                <input id="content-image-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setUploadingContentImage(true)
                  try {
                    const fd = new FormData()
                    fd.append('file', file)
                    fd.append('folder', 'articles')
                    fd.append('storage', 'blob')
                    const res = await fetch('/api/upload', { method: 'POST', body: fd })
                    const json = await res.json()
                    if (json?.success && json.url) {
                      const nextUrl = json.provider === 'gdrive' && json.id ? `/api/drive-image?id=${json.id}` : json.url
                      await copyToClipboard(nextUrl)
                    } else {
                      throw new Error(json?.error || 'Upload gagal')
                    }
                  } catch {
                    toast({ title: 'Gagal', description: 'Tidak dapat mengunggah gambar', variant: 'destructive' })
                  } finally {
                    setUploadingContentImage(false)
                    e.currentTarget.value = ''
                  }
                }} />
                <Button type="button" variant="outline" onClick={() => document.getElementById('content-image-upload')?.click()} disabled={uploadingContentImage}>
                  {uploadingContentImage ? 'Mengunggah...' : 'Unggah Gambar untuk Konten'}
                </Button>
                <span className="text-xs text-slate-500">Setelah upload, URL otomatis disalin — gunakan tombol Insert Image pada toolbar editor.</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Kategori</Label><Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}><SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Penulis</Label><Input placeholder="Nama penulis" value={formData.author} onChange={(e) => handleInputChange('author', e.target.value)} required /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Waktu Baca</Label><Input placeholder="5 menit" value={formData.readTime} onChange={(e) => handleInputChange('readTime', e.target.value)} /></div>
              <div className="flex items-end gap-4 pb-2">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => handleInputChange('featured', e.target.checked)} className="rounded" /><span className="text-sm">Featured</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.published} onChange={(e) => handleInputChange('published', e.target.checked)} className="rounded" /><span className="text-sm">Publish</span></label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
