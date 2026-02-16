'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Image as ImageIcon, GripVertical } from 'lucide-react'

interface Slide {
  id: string
  title: string
  subtitle: string
  description: string | null
  buttonText: string | null
  buttonUrl: string | null
  imageUrl: string | null
  order: number
  active: boolean
}

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '', subtitle: '', description: '', buttonText: '', buttonUrl: '', imageUrl: '', order: 0, active: true
  })

  useEffect(() => { fetchSlides() }, [])

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/slides')
      const result = await response.json()
      if (result.success) setSlides(result.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingSlide(null)
    setFormData({ title: '', subtitle: '', description: '', buttonText: '', buttonUrl: '', imageUrl: '', order: slides.length, active: true })
    setIsDialogOpen(true)
  }

  const openEditDialog = (slide: Slide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title, subtitle: slide.subtitle, description: slide.description || '',
      buttonText: slide.buttonText || '', buttonUrl: slide.buttonUrl || '', imageUrl: slide.imageUrl || '',
      order: slide.order, active: slide.active
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const method = editingSlide ? 'PUT' : 'POST'
      const body = editingSlide ? { ...formData, id: editingSlide.id } : formData
      const response = await fetch('/api/admin/slides', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!' })
        setIsDialogOpen(false)
        fetchSlides()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus slide ini?')) return
    try {
      const response = await fetch(`/api/admin/slides?id=${id}`, { method: 'DELETE' })
      if ((await response.json()).success) {
        toast({ title: 'Berhasil!' })
        fetchSlides()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Kelola Hero Slider</h1>
          <p className="text-slate-500 mt-1">Atur slide yang tampil di halaman utama</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" /> Tambah Slide
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? <div className="text-center py-12 text-slate-400">Memuat...</div> : slides.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-400">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada slide. Tambahkan slide untuk ditampilkan di hero section.</p>
            </CardContent>
          </Card>
        ) : (
          slides.map((s, index) => (
            <Card key={s.id} className={!s.active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-slate-300" />
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                  
                  {s.imageUrl ? (
                    <div className="w-24 h-16 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                      <img src={s.imageUrl} alt="Slide preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">Hero</span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{s.title}</h3>
                      {!s.active && <Badge variant="secondary">Nonaktif</Badge>}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{s.subtitle}</p>
                    {s.buttonText && (
                      <p className="text-xs text-amber-600 mt-1">Button: {s.buttonText}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(s)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingSlide ? 'Edit Slide' : 'Tambah Slide'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Judul Utama</Label>
              <Input placeholder="Pendampingan Hukum Profesional" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Subtitle / Tagline</Label>
              <Input placeholder="Solusi Hukum Terpercaya" value={formData.subtitle} onChange={(e) => setFormData(p => ({ ...p, subtitle: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi (opsional)</Label>
              <Textarea placeholder="Deskripsi singkat..." rows={2} value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Teks Tombol</Label>
                <Input placeholder="Konsultasi Gratis" value={formData.buttonText} onChange={(e) => setFormData(p => ({ ...p, buttonText: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>URL Tombol</Label>
                <Input placeholder="#contact" value={formData.buttonUrl} onChange={(e) => setFormData(p => ({ ...p, buttonUrl: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL Gambar (opsional)</Label>
              <Input placeholder="https://..." value={formData.imageUrl} onChange={(e) => setFormData(p => ({ ...p, imageUrl: e.target.value }))} />
              <p className="text-xs text-slate-400">Kosongkan untuk menggunakan gradient default</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <Label>Urutan</Label>
                <Input type="number" value={formData.order} onChange={(e) => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
              </div>
              <label className="flex items-center gap-2 pt-6">
                <input type="checkbox" checked={formData.active} onChange={(e) => setFormData(p => ({ ...p, active: e.target.checked }))} className="rounded" />
                <span className="text-sm">Aktif</span>
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
