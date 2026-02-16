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
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  order: number
  active: boolean
}

const iconOptions = ['MessageSquare', 'Shield', 'Gavel', 'FileText', 'HandshakeIcon', 'Building2', 'Home', 'Briefcase', 'Car', 'Heart', 'Scale']

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({ title: '', description: '', icon: 'MessageSquare', order: 0, active: true })

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      const result = await response.json()
      if (result.success) setServices(result.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingService(null)
    setFormData({ title: '', description: '', icon: 'MessageSquare', order: services.length, active: true })
    setIsDialogOpen(true)
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setFormData({ title: service.title, description: service.description, icon: service.icon, order: service.order, active: service.active })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const method = editingService ? 'PUT' : 'POST'
      const body = editingService ? { ...formData, id: editingService.id } : formData
      const response = await fetch('/api/admin/services', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!' })
        setIsDialogOpen(false)
        fetchServices()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus layanan ini?')) return
    try {
      const response = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' })
      if ((await response.json()).success) {
        toast({ title: 'Berhasil!' })
        fetchServices()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Kelola Layanan</h1>
          <p className="text-slate-500 mt-1">Atur layanan hukum yang ditampilkan</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" /> Tambah Layanan
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-full text-center py-12 text-slate-400">Memuat...</div> : services.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400"><Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Belum ada layanan</p></div>
        ) : (
          services.map(s => (
            <Card key={s.id} className={!s.active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(s)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{s.description}</p>
                <Badge variant="outline" className="mt-2">{s.icon}</Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingService ? 'Edit Layanan' : 'Tambah Layanan'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2"><Label>Nama Layanan</Label><Input placeholder="Konsultasi Hukum" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Deskripsi</Label><Textarea placeholder="Deskripsi layanan..." rows={2} value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Icon</Label>
              <select className="w-full border rounded-lg p-2" value={formData.icon} onChange={(e) => setFormData(p => ({ ...p, icon: e.target.value }))}>
                {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1"><Label>Urutan</Label><Input type="number" value={formData.order} onChange={(e) => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} /></div>
              <label className="flex items-center gap-2 pt-6"><input type="checkbox" checked={formData.active} onChange={(e) => setFormData(p => ({ ...p, active: e.target.checked }))} className="rounded" /><span className="text-sm">Aktif</span></label>
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
