'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Scale,
  ArrowRight,
  MessageSquare,
  Shield,
  Gavel,
  FileText,
  HandshakeIcon,
  CheckCircle2,
  Building2,
  Home,
  Briefcase,
  Car,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

const mainServices = [
  {
    id: 'konsultasi',
    icon: MessageSquare,
    title: 'Konsultasi Hukum',
    shortDesc: 'Memberikan arahan dan solusi atas permasalahan hukum yang Anda hadapi.',
    description: 'Layanan konsultasi hukum memberikan Anda akses langsung ke tim advokat berpengalaman untuk mendiskusikan permasalahan hukum Anda. Kami memberikan analisis mendalam, opsi solusi, dan langkah-langkah strategis yang perlu diambil.',
    features: [
      'Konsultasi tatap muka atau online',
      'Analisis kasus mendalam',
      'Pendapat hukum tertulis',
      'Rekomendasi langkah selanjutnya',
      'Estimasi biaya dan waktu penanganan',
    ],
    process: [
      'Jadwalkan konsultasi',
      'Diskusikan permasalahan Anda',
      'Dapatkan analisis dan solusi',
      'Terima rekomendasi tertulis',
    ],
  },
  {
    id: 'pidana',
    icon: Shield,
    title: 'Pendampingan Perkara Pidana',
    shortDesc: 'Pendampingan dan pembelaan hukum dalam proses penyidikan hingga persidangan.',
    description: 'Kami memberikan pendampingan hukum komprehensif dalam perkara pidana, mulai dari tahap penyidikan di kepolisian hingga proses persidangan di pengadilan. Tim kami berpengalaman menangani berbagai jenis perkara pidana.',
    features: [
      'Pendampingan saat pemeriksaan',
      'Penyusunan jawaban dan pledoi',
      'Pembelaan di persidangan',
      'Upaya hukum banding dan kasasi',
      'Restitusi dan kompensasi korban',
    ],
    process: [
      'Konsultasi awal kasus',
      'Pengumpulan bukti dan keterangan',
      'Penyusunan strategi pembelaan',
      'Pendampingan pemeriksaan',
      'Pembelaan di persidangan',
    ],
  },
  {
    id: 'perdata',
    icon: Gavel,
    title: 'Penyelesaian Sengketa Perdata',
    shortDesc: 'Penanganan sengketa perdata secara litigasi maupun non-litigasi.',
    description: 'Kami menangani berbagai sengketa perdata dengan pendekatan litigasi (pengadilan) maupun non-litigasi (musyawarah). Prioritas kami adalah mencapai solusi terbaik dengan efisien dan efektif.',
    features: [
      'Sengketa tanah dan properti',
      'Sengketa waris',
      'Sengketa perjanjian/kontrak',
      'Perkara perceraian',
      'Sengketa hak asuh anak',
    ],
    process: [
      'Analisis kasus dan bukti',
      'Upaya perdamaian',
      'Penyusunan gugatan/jawaban',
      'Persidangan atau mediasi',
      'Eksekusi putusan',
    ],
  },
  {
    id: 'dokumen',
    icon: FileText,
    title: 'Pembuatan Dokumen Hukum',
    shortDesc: 'Penyusunan kontrak, perjanjian, dan dokumen hukum lainnya secara profesional.',
    description: 'Kami menyusun berbagai dokumen hukum dengan standar profesional tinggi, memastikan perlindungan kepentingan Anda dan kepatuhan terhadap regulasi yang berlaku.',
    features: [
      'Kontrak kerja dan bisnis',
      'Perjanjian jual beli',
      'Akta pendirian perusahaan',
      'Perjanjian sewa-menyewa',
      'Surat kuasa dan wasiat',
    ],
    process: [
      'Identifikasi kebutuhan',
      'Penyusunan draft',
      'Review dan revisi',
      'Finalisasi dokumen',
    ],
  },
  {
    id: 'mediasi',
    icon: HandshakeIcon,
    title: 'Mediasi dan Negosiasi',
    shortDesc: 'Membantu penyelesaian masalah hukum melalui pendekatan musyawarah.',
    description: 'Kami memfasilitasi mediasi dan negosiasi untuk menyelesaikan sengketa secara damai. Pendekatan ini seringkali lebih cepat, hemat biaya, dan menjaga hubungan baik antara para pihak.',
    features: [
      'Mediasi sengketa bisnis',
      'Negosiasi kontrak',
      'Penyelesaian sengketa keluarga',
      'Mediasi ketenagakerjaan',
      'Facilitated discussion',
    ],
    process: [
      'Identifikasi isu dan kepentingan',
      'Penjadwalan mediasi',
      'Sesi mediasi terfasilitasi',
      'Penyusunan kesepakatan',
      'Implementasi dan monitoring',
    ],
  },
]

const additionalServices = [
  { icon: Building2, title: 'Hukum Korporasi', desc: 'Pendampingan legal untuk perusahaan' },
  { icon: Home, title: 'Hukum Properti', desc: 'Sengketa tanah dan transaksi properti' },
  { icon: Briefcase, title: 'Hukum Ketenagakerjaan', desc: 'Hubungan industrial dan PHK' },
  { icon: Car, title: 'Hukum Lalu Lintas', desc: 'Kecelakaan dan sengketa asuransi' },
  { icon: Heart, title: 'Hukum Keluarga', desc: 'Perceraian, hak asuh, nafkah' },
  { icon: Scale, title: 'Hukum Waris', desc: 'Pembagian harta waris dan wasiat' },
]

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nomorWhatsapp: '',
    email: '',
    jenisPermasalahan: '',
    pesan: '',
  })

  const buildWhatsappUrl = (data: { namaLengkap: string; nomorWhatsapp: string; email: string; jenisPermasalahan: string; pesan: string }) => {
    const base = 'https://wa.me/14176308853'
    const text =
      `Halo YKBH Malahayati, saya ${data.namaLengkap}.\n\n` +
      'Saya baru mengisi form konsultasi di website.\n\n' +
      `Nama: ${data.namaLengkap}\n` +
      `WhatsApp: ${data.nomorWhatsapp}\n` +
      `Email: ${data.email}\n` +
      `Jenis Permasalahan: ${data.jenisPermasalahan || '-'}\n` +
      `Pesan: ${data.pesan}`
    return `${base}?text=${encodeURIComponent(text)}`
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = { ...formData }
      const response = await fetch('/api/konsultasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!', description: 'Permintaan konsultasi Anda telah terkirim.' })
        if (typeof window !== 'undefined') {
          const waUrl = buildWhatsappUrl(payload)
          window.open(waUrl, '_blank')
        }
        setFormData({ namaLengkap: '', nomorWhatsapp: '', email: '', jenisPermasalahan: '', pesan: '' })
        setIsDialogOpen(false)
      } else {
        throw new Error(result.error)
      }
    } catch {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan. Silakan coba lagi.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Layanan Kami</span>
              <h1 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
                Layanan Hukum Profesional
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Kami menyediakan berbagai layanan hukum untuk memenuhi kebutuhan individu maupun perusahaan dengan standar profesional dan harga yang kompetitif.
              </p>
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Layanan Utama</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Apa yang Kami Tawarkan</h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {mainServices.map((service) => {
                const Icon = service.icon
                const isExpanded = expandedService === service.id

                return (
                  <Card
                    key={service.id}
                    className={`border-0 shadow-lg transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary' : ''}`}
                  >
                    <CardContent className="p-0">
                      <button
                        onClick={() => setExpandedService(isExpanded ? null : service.id)}
                        className="w-full p-6 flex items-center gap-6 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                          <p className="text-slate-600">{service.shortDesc}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-6 w-6 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-slate-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-6 pt-0 border-t border-slate-100">
                          <div className="grid md:grid-cols-2 gap-8 pt-6">
                            <div>
                              <h4 className="font-semibold mb-3">Deskripsi</h4>
                              <p className="text-slate-600 mb-6">{service.description}</p>

                              <h4 className="font-semibold mb-3">Cakupan Layanan</h4>
                              <ul className="space-y-2">
                                {service.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-600">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-4">Proses Penanganan</h4>
                              <div className="space-y-4">
                                {service.process.map((step, idx) => (
                                  <div key={idx} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <span className="text-primary font-semibold text-sm">{idx + 1}</span>
                                    </div>
                                    <span className="pt-1">{step}</span>
                                  </div>
                                ))}
                              </div>

                              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800" onClick={() => handleInputChange('jenisPermasalahan', service.id)}>
                                    Konsultasi Layanan Ini
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl">Konsultasi - {service.title}</DialogTitle>
                                    <DialogDescription>Isi form berikut, tim kami akan merespons dalam 1x24 jam.</DialogDescription>
                                  </DialogHeader>
                                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                      <Label>Nama Lengkap</Label>
                                      <Input placeholder="Nama lengkap Anda" value={formData.namaLengkap} onChange={(e) => handleInputChange('namaLengkap', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Nomor WhatsApp</Label>
                                      <Input placeholder="08123456789" value={formData.nomorWhatsapp} onChange={(e) => handleInputChange('nomorWhatsapp', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Email</Label>
                                      <Input type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Pesan</Label>
                                      <Textarea rows={4} placeholder="Jelaskan permasalahan Anda..." value={formData.pesan} onChange={(e) => handleInputChange('pesan', e.target.value)} required />
                                    </div>
                                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isSubmitting}>
                                      {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
                                    </Button>
                                  </form>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Layanan Lainnya</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Bidang Praktik Lainnya</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {additionalServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                      <p className="text-slate-600">{service.desc}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tidak Menemukan Layanan yang Anda Cari?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-lg">
              Hubungi kami untuk mendiskusikan kebutuhan hukum Anda
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-6">
                Hubungi Kami
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
