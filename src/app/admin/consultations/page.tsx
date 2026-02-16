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
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Search, Eye, MessageSquare, Clock, CheckCircle, Phone } from 'lucide-react'

interface Consultation {
  id: string
  namaLengkap: string
  nomorWhatsapp: string
  email: string
  jenisPermasalahan: string
  pesan: string
  status: string
  notes: string | null
  createdAt: string
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [notes, setNotes] = useState('')
  const { toast } = useToast()

  useEffect(() => { fetchConsultations() }, [])

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/admin/consultations')
      const result = await response.json()
      if (result.success) setConsultations(result.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/consultations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if ((await response.json()).success) {
        toast({ title: 'Berhasil!', description: 'Status diperbarui' })
        fetchConsultations()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  const saveNotes = async () => {
    if (!selectedConsultation) return
    try {
      const response = await fetch('/api/admin/consultations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedConsultation.id, notes }),
      })
      if ((await response.json()).success) {
        toast({ title: 'Berhasil!', description: 'Catatan disimpan' })
        fetchConsultations()
      }
    } catch (error) {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  const filteredConsultations = consultations.filter(c =>
    (c.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'all' || c.status === filterStatus)
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'contacted': return <Badge className="bg-blue-500"><Phone className="h-3 w-3 mr-1" />Dihubungi</Badge>
      case 'completed': return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Selesai</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Permintaan Konsultasi</h1>
        <p className="text-slate-500 mt-1">Kelola permintaan konsultasi dari klien</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Cari nama atau email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'contacted', 'completed'].map(s => (
                <Button key={s} variant={filterStatus === s ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(s)} className={filterStatus === s ? 'bg-amber-500 hover:bg-amber-600' : ''}>
                  {s === 'all' ? 'Semua' : s === 'pending' ? 'Pending' : s === 'contacted' ? 'Dihubungi' : 'Selesai'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading ? <div className="text-center py-12 text-slate-400">Memuat...</div> : filteredConsultations.length === 0 ? (
          <div className="text-center py-12 text-slate-400"><MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Belum ada konsultasi</p></div>
        ) : (
          filteredConsultations.map(c => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{c.namaLengkap}</h3>
                      {getStatusBadge(c.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-500 mb-3">
                      <span><Phone className="h-4 w-4 inline mr-1" />{c.nomorWhatsapp}</span>
                      <span className="hidden sm:inline">{c.email}</span>
                      <span>{formatDate(c.createdAt)}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Jenis: {c.jenisPermasalahan}</div>
                      <p className="text-sm text-slate-600 line-clamp-2">{c.pesan}</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedConsultation(c); setNotes(c.notes || '') }}>
                      <Eye className="h-4 w-4 mr-1" /> Detail
                    </Button>
                    {c.status === 'pending' && (
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={() => updateStatus(c.id, 'contacted')}>
                        <Phone className="h-4 w-4 mr-1" /> Hubungi
                      </Button>
                    )}
                    {c.status === 'contacted' && (
                      <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => updateStatus(c.id, 'completed')}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Selesai
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedConsultation} onOpenChange={() => setSelectedConsultation(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detail Konsultasi</DialogTitle></DialogHeader>
          {selectedConsultation && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-slate-400 text-xs">Nama</Label><p className="font-medium">{selectedConsultation.namaLengkap}</p></div>
                <div><Label className="text-slate-400 text-xs">WhatsApp</Label><p className="font-medium">{selectedConsultation.nomorWhatsapp}</p></div>
                <div><Label className="text-slate-400 text-xs">Email</Label><p className="font-medium">{selectedConsultation.email}</p></div>
                <div><Label className="text-slate-400 text-xs">Jenis</Label><p className="font-medium">{selectedConsultation.jenisPermasalahan}</p></div>
              </div>
              <div><Label className="text-slate-400 text-xs">Pesan</Label><p className="bg-slate-50 rounded-lg p-3 text-sm">{selectedConsultation.pesan}</p></div>
              <div><Label className="text-slate-400 text-xs">Catatan Internal</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tambahkan catatan..." rows={3} /></div>
              <div className="flex gap-2">
                <Button onClick={saveNotes} className="bg-amber-500 hover:bg-amber-600">Simpan Catatan</Button>
                <a href={`https://wa.me/${selectedConsultation.nomorWhatsapp.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline"><Phone className="h-4 w-4 mr-1" /> WhatsApp</Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
