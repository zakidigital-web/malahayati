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
import { Plus, Edit, Trash2, Star, MessageSquare } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  order: number
  active: boolean
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({ name: '', role: '', content: '', rating: 5, order: 0, active: true })

  useEffect(() => { fetchTestimonials() }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials')
      const result = await response.json()
      if (result.success) setTestimonials(result.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingItem(null)
    setFormData({ name: '', role: '', content: '', rating: 5, order: testimonials.length, active: true })
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: Testimonial) => {
    setEditingItem(item)
    setFormData({ name: item.name, role: item.role, content: item.content, rating: item.rating, order: item.order, active: item.active })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem ? { ...formData, id: editingItem.id } : formData
      const response = await fetch('/api/admin/testimonials', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!' })
        setIsDialogOpen(false)
        fetchTestimonials()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return
    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
      if ((await response.json()).success) {
        toast({ title: 'Berhasil!', description: 'Testimoni dihapus' })
        fetchTestimonials()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Kelola Testimoni</h1>
          <p className="text-slate-500 mt-1">Atur testimoni klien di website</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" /> Tambah Testimoni
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-full text-center py-12 text-slate-400">Memuat...</div> : testimonials.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400"><MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Belum ada testimoni</p></div>
        ) : (
          testimonials.map(t => (
            <Card key={t.id} className={!t.active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}</div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(t)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic mb-3">&quot;{t.content}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingItem ? 'Edit Testimoni' : 'Tambah Testimoni'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2"><Label>Nama</Label><Input placeholder="Nama klien" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Jabatan/Peran</Label><Input placeholder="Pengusaha, Manager, dll" value={formData.role} onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Testimoni</Label><Textarea placeholder="Tulis testimoni..." rows={3} value={formData.content} onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))} required /></div>
            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1"><Label>Rating</Label><Input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData(p => ({ ...p, rating: parseInt(e.target.value) || 5 }))} /></div>
              <div className="space-y-2 flex-1"><Label>Urutan</Label><Input type="number" value={formData.order} onChange={(e) => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} /></div>
            </div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.active} onChange={(e) => setFormData(p => ({ ...p, active: e.target.checked }))} className="rounded" /><span className="text-sm">Aktif</span></label>
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
