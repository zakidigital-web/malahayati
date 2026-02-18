'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Users, Image as ImageIcon, Loader2, X } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  description: string
  education: string
  imageUrl?: string | null
  order: number
  active: boolean
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({ name: '', role: '', description: '', education: '', imageUrl: '' as string | undefined, order: 0, active: true })
  const [uploading, setUploading] = useState(false)

  const normalizeImageUrl = (url: string) => {
    if (!url) return url
    try {
      const u = new URL(url)
      const host = u.hostname
      if (host.includes('drive.google.com')) {
        if (u.pathname.includes('/file/d/')) {
          const parts = u.pathname.split('/')
          const idIndex = parts.findIndex(p => p === 'd') + 1
          const fileId = parts[idIndex]
          if (fileId) return `https://drive.google.com/uc?export=view&id=${fileId}`
        }
        const idParam = u.searchParams.get('id')
        if (idParam) return `https://drive.google.com/uc?export=view&id=${idParam}`
      }
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
        // Extract id and proxy through our API for reliable rendering
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

  useEffect(() => { fetchMembers() }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/team')
      const result = await response.json()
      if (result.success) setMembers(result.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingMember(null)
    setFormData({ name: '', role: '', description: '', education: '', imageUrl: '', order: members.length, active: true })
    setIsDialogOpen(true)
  }

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({ name: member.name, role: member.role, description: member.description, education: member.education, imageUrl: member.imageUrl || '', order: member.order, active: member.active })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const method = editingMember ? 'PUT' : 'POST'
      const body = editingMember ? { ...formData, id: editingMember.id } : formData
      const response = await fetch('/api/admin/team', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!', description: editingMember ? 'Anggota tim diperbarui' : 'Anggota tim ditambahkan' })
        setIsDialogOpen(false)
        fetchMembers()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus anggota tim ini?')) return
    try {
      const response = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' })
      if ((await response.json()).success) {
        toast({ title: 'Berhasil!', description: 'Anggota tim dihapus' })
        fetchMembers()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Kelola Tim</h1>
          <p className="text-slate-500 mt-1">Atur anggota tim yang ditampilkan di website</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" /> Tambah Anggota
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-full text-center py-12 text-slate-400">Memuat...</div> : members.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400"><Users className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Belum ada anggota tim</p></div>
        ) : (
          members.map(m => (
            <Card key={m.id} className={!m.active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  {m.imageUrl ? (
                    <img src={m.imageUrl} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">
                      {m.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(m)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-sm text-amber-600 font-medium">{m.role}</p>
                <p className="text-sm text-slate-500 mt-2">{m.description}</p>
                <p className="text-xs text-slate-400 mt-2">{m.education}</p>
                <div className="mt-2">
                  {m.imageUrl ? (
                    <a href={toDisplayUrl(m.imageUrl)} target="_blank" rel="noreferrer" className="text-xs text-amber-600 hover:underline">
                      Lihat Foto
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Tidak ada foto</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingMember ? 'Edit Anggota' : 'Tambah Anggota Tim'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2"><Label>Nama Lengkap</Label><Input placeholder="Dr. Nama Lengkap, S.H., M.H." value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Jabatan</Label><Input placeholder="Senior Partner" value={formData.role} onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Deskripsi</Label><Textarea placeholder="Deskripsi singkat..." rows={2} value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Pendidikan</Label><Input placeholder="S3 Ilmu Hukum - UI" value={formData.education} onChange={(e) => setFormData(p => ({ ...p, education: e.target.value }))} required /></div>
            <div className="space-y-2">
              <Label>URL Gambar (opsional)</Label>
              <Input
                placeholder="Tempel URL gambar (mendukung Google Drive publik)"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData(p => ({ ...p, imageUrl: e.target.value }))}
                onBlur={(e) => {
                  const normalized = normalizeImageUrl(e.target.value.trim())
                  if (normalized !== e.target.value.trim()) {
                    setFormData(p => ({ ...p, imageUrl: normalized }))
                    toast({ title: 'URL diubah', description: 'Link Google Drive diubah ke link langsung' })
                  }
                }}
              />
              <p className="text-xs text-slate-500">Contoh Google Drive: https://drive.google.com/file/d/FILE_ID/view akan otomatis diubah.</p>
            </div>
            <div className="space-y-2">
              <Label>Foto (opsional)</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {formData.imageUrl ? (
                    <img src={toDisplayUrl(formData.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input id="team-photo-input" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploading(true)
                    try {
                      const fd = new FormData()
                      fd.append('file', file)
                      fd.append('folder', 'team')
                      fd.append('storage', 'drive')
                      const res = await fetch('/api/upload', { method: 'POST', body: fd })
                      const json = await res.json()
                      if (json?.success && json.url) {
                        const nextUrl = json.provider === 'gdrive' && json.id ? `/api/drive-image?id=${json.id}` : json.url
                        setFormData(p => ({ ...p, imageUrl: nextUrl }))
                        toast({ title: 'Foto terunggah', description: 'Foto berhasil diunggah' })
                      } else {
                        throw new Error(json?.error || 'Upload gagal')
                      }
                    } catch {
                      toast({ title: 'Gagal', description: 'Tidak dapat mengunggah foto', variant: 'destructive' })
                    } finally {
                      setUploading(false)
                      e.currentTarget.value = ''
                    }
                  }} />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('team-photo-input')?.click()} disabled={uploading}>
                    {uploading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Mengunggah...</>) : (<>Unggah Foto</>)}
                  </Button>
                  {formData.imageUrl && (
                    <Button type="button" variant="ghost" onClick={() => setFormData(p => ({ ...p, imageUrl: '' }))} title="Hapus foto">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
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
