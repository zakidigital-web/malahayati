'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  Scale, FileText, MessageSquare, HandshakeIcon, Shield,
  ChevronRight, Gavel, Building2, Home, Briefcase, Car, Heart,
  CheckCircle2, ArrowRight, Plus, Minus,
} from 'lucide-react'

const mainServices = [
  { icon: MessageSquare, title: 'Konsultasi Hukum', desc: 'Akses langsung ke advokat berpengalaman.', features: ['Konsultasi tatap muka/online', 'Analisis kasus mendalam', 'Pendapat hukum tertulis', 'Rekomendasi langkah selanjutnya'] },
  { icon: Shield, title: 'Perkara Pidana', desc: 'Pendampingan dari penyidikan hingga persidangan.', features: ['Pendampingan pemeriksaan', 'Penyusunan pledoi', 'Pembelaan persidangan', 'Upaya hukum banding/kasasi'] },
  { icon: Gavel, title: 'Sengketa Perdata', desc: 'Penanganan litigasi dan non-litigasi.', features: ['Sengketa tanah & properti', 'Sengketa waris', 'Perkara perjanjian', 'Perkara perceraian'] },
  { icon: FileText, title: 'Dokumen Hukum', desc: 'Penyusunan dokumen profesional.', features: ['Kontrak kerja & bisnis', 'Perjanjian jual beli', 'Akta pendirian perusahaan', 'Surat kuasa & wasiat'] },
  { icon: HandshakeIcon, title: 'Mediasi & Negosiasi', desc: 'Penyelesaian sengketa secara damai.', features: ['Mediasi sengketa bisnis', 'Negosiasi kontrak', 'Penyelesaian sengketa keluarga', 'Mediasi ketenagakerjaan'] },
]

const iconMap: Record<string, any> = {
  MessageSquare,
  Shield,
  Gavel,
  FileText,
  HandshakeIcon,
  Scale,
  Briefcase,
  Building2,
  Home,
  Car,
  Heart,
}

const otherServices = [
  { icon: Building2, title: 'Hukum Korporasi', desc: 'Merger, akuisisi, regulasi' },
  { icon: Home, title: 'Hukum Properti', desc: 'Sengketa tanah, properti' },
  { icon: Briefcase, title: 'Ketenagakerjaan', desc: 'Hubungan industrial, PHK' },
  { icon: Car, title: 'Lalu Lintas', desc: 'Kecelakaan, pelanggaran' },
  { icon: Heart, title: 'Hukum Keluarga', desc: 'Perceraian, hak asuh' },
  { icon: Scale, title: 'Hukum Waris', desc: 'Pembagian waris, wasiat' },
]

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<number | null>(0)
  const [servicesData, setServicesData] = useState(mainServices)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    namaLengkap: '', nomorWhatsapp: '', email: '', jenisPermasalahan: '', pesan: '',
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/admin/services', { cache: 'no-store' })
        const json = await res.json()
        if (json?.success && Array.isArray(json.data) && json.data.length) {
          const items = json.data
            .filter((s: any) => s.active !== false)
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((s: any) => {
              const Icon = iconMap[s.icon] ?? MessageSquare
              return { icon: Icon, title: s.title, desc: s.description, features: [] as string[] }
            })
          if (items.length) setServicesData(items)
        }
      } catch {}
    }
    fetchServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/konsultasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!', description: 'Permintaan terkirim.' })
        setFormData({ namaLengkap: '', nomorWhatsapp: '', email: '', jenisPermasalahan: '', pesan: '' })
        setIsDialogOpen(false)
      } else throw new Error(result.error)
    } catch {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-amber-400 text-xs sm:text-sm font-medium tracking-widest uppercase mb-4 sm:mb-6">
              Layanan Kami
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Solusi Hukum
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Komprehensif
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed">
              Dari konsultasi hingga pendampingan persidangan.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
              Layanan Utama
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Apa yang Kami Tawarkan
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {servicesData.map((service, index) => {
              const Icon = service.icon
              const isExpanded = expandedService === index
              return (
                <Card
                  key={index}
                  className={`border-0 transition-all cursor-pointer ${
                    isExpanded ? 'bg-amber-50 shadow-lg' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                  onClick={() => setExpandedService(isExpanded ? null : index)}
                >
                  <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                      isExpanded ? 'bg-amber-500 text-white' : 'bg-white text-amber-600'
                    }`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg lg:text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm lg:text-base mt-1 hidden sm:block">{service.desc}</CardDescription>
                    </div>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                      isExpanded ? 'bg-amber-500 text-white' : 'bg-white text-slate-400'
                    }`}>
                      {isExpanded ? <Minus className="h-4 w-4 sm:h-5 sm:w-5" /> : <Plus className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </div>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent className="border-t border-amber-200 p-4 sm:p-6">
                      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm sm:text-base mb-3 sm:mb-4">Cakupan Layanan</h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {(service.features || []).map((f, i) => (
                              <li key={i} className="flex items-center gap-2 sm:gap-3">
                                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
                                <span className="text-slate-700 text-xs sm:text-sm lg:text-base">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col justify-center items-center bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8">
                          <p className="text-slate-600 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 text-center">
                            {service.desc || 'Butuh layanan ini? Konsultasikan permasalahan Anda.'}
                          </p>
                          <Button 
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm"
                            onClick={(e) => { e.stopPropagation(); setIsDialogOpen(true) }}
                          >
                            Konsultasi <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
              Bidang Lainnya
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Layanan Tambahan
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {otherServices.map((s, i) => {
              const Icon = s.icon
              return (
                <Card key={i} className="border-0 bg-white hover:shadow-lg transition-shadow group">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-amber-600 mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1">{s.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">{s.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Tidak Menemukan Layanan Anda?
          </h2>
          <p className="text-amber-100 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
            Hubungi kami untuk mendiskusikan kebutuhan hukum spesifik Anda.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-amber-600 hover:bg-amber-50"
            onClick={() => setIsDialogOpen(true)}
          >
            Konsultasi Gratis <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl">Konsultasi Gratis</DialogTitle>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Tim kami akan menghubungi Anda dalam 1x24 jam.</p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Nama Lengkap</Label>
              <Input placeholder="Nama Anda" value={formData.namaLengkap}
                onChange={(e) => setFormData(p => ({ ...p, namaLengkap: e.target.value }))} required className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">WhatsApp</Label>
              <Input placeholder="08123456789" value={formData.nomorWhatsapp}
                onChange={(e) => setFormData(p => ({ ...p, nomorWhatsapp: e.target.value }))} required className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Email</Label>
              <Input type="email" placeholder="email@example.com" value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} required className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Jenis Permasalahan</Label>
              <Select value={formData.jenisPermasalahan} onValueChange={(v) => setFormData(p => ({ ...p, jenisPermasalahan: v }))}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Pilih jenis" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pidana">Perkara Pidana</SelectItem>
                  <SelectItem value="perdata">Sengketa Perdata</SelectItem>
                  <SelectItem value="keluarga">Hukum Keluarga</SelectItem>
                  <SelectItem value="bisnis">Hukum Bisnis</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Pesan</Label>
              <Textarea placeholder="Jelaskan permasalahan..." rows={3}
                value={formData.pesan} onChange={(e) => setFormData(p => ({ ...p, pesan: e.target.value }))} required className="text-sm" />
            </div>
            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
