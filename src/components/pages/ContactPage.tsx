'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Facebook, Instagram, Linkedin } from 'lucide-react'

const contactInfo = [
  { icon: MapPin, title: 'Alamat', lines: ['Perumahan Candra Kirana Asri Blok C1 Kertosari'] },
  { icon: Phone, title: 'Telepon / WhatsApp', lines: ['+1 417 6308853'] },
  { icon: Mail, title: 'Email', lines: ['ykbhmalahayati@gmail.com'] },
  { icon: Clock, title: 'Jam Operasional', lines: ['Senin – Jumat', '08.00 – 17.00 WIB'] },
]

const faqs = [
  { q: 'Bagaimana cara mengajukan konsultasi?', a: 'Melalui form di website ini atau WhatsApp kami.' },
  { q: 'Berapa biaya konsultasi awal?', a: 'Konsultasi awal gratis. Biaya lanjutan setelah analisis.' },
  { q: 'Apakah konsultasi bisa online?', a: 'Ya, via video call atau telepon.' },
  { q: 'Bagaimana cara pembayaran?', a: 'Transfer bank atau langsung di kantor.' },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    namaLengkap: '', nomorWhatsapp: '', email: '', jenisPermasalahan: '', pesan: '',
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
        toast({ title: 'Berhasil!', description: 'Pesan terkirim.' })
        if (typeof window !== 'undefined') {
          const waUrl = buildWhatsappUrl(payload)
          window.open(waUrl, '_blank')
        }
        setFormData({ namaLengkap: '', nomorWhatsapp: '', email: '', jenisPermasalahan: '', pesan: '' })
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
              Hubungi Kami
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Kami Siap
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Membantu Anda
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed">
              Hubungi kami untuk konsultasi. Tim kami merespons dalam 1x24 jam.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Info */}
            <div>
              <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
                Informasi Kontak
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">Hubungi Kami Kapan Saja</h2>
              <p className="text-slate-600 text-sm sm:text-base mb-6 sm:mb-8">
                Kami berkomitmen merespons setiap pertanyaan dalam 1x24 jam.
              </p>
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon
                  return (
                    <div key={i} className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{info.title}</h3>
                        {info.lines.map((line, j) => (
                          <p key={j} className="text-slate-600 text-xs sm:text-sm">{line}</p>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-3 sm:mb-4">Ikuti Kami</h3>
                <div className="flex gap-2 sm:gap-3">
                  {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                    <a key={i} href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-amber-100 hover:text-amber-600 transition-colors">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <Card className="border-0 shadow-xl bg-slate-50">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Kirim Pesan</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">Isi form dan tim kami akan menghubungi Anda.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
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
                    <Textarea placeholder="Jelaskan permasalahan..." rows={4}
                      value={formData.pesan} onChange={(e) => setFormData(p => ({ ...p, pesan: e.target.value }))} required className="text-sm" />
                  </div>
                  <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-sm" disabled={isSubmitting}>
                    {isSubmitting ? 'Mengirim...' : <>Kirim Pesan <Send className="ml-2 h-4 w-4" /></>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-slate-100">
        <div className="h-64 sm:h-80 lg:h-[420px]">
          <iframe
            src="https://www.google.com/maps?q=Perumahan%20Candra%20Kirana%20Asri%20Blok%20C1%20Kertosari&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0"
            allowFullScreen
            title="Lokasi Kantor YKBH Malahayati"
          />
        </div>
        <div className="text-center text-slate-500 text-xs sm:text-sm py-3">
          <a
            href="https://maps.app.goo.gl/vFtzQzE2ig92ACkR6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-500 font-medium"
          >
            Buka di Google Maps
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Pertanyaan Umum</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {faqs.map((faq, i) => (
              <Card key={i} className="border-0 bg-slate-50">
                <CardHeader className="p-4 sm:p-5 lg:p-6">
                  <CardTitle className="text-sm sm:text-base lg:text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
                  <p className="text-slate-600 text-xs sm:text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">Butuh Bantuan Segera?</h2>
          <p className="text-amber-100 text-sm sm:text-base mb-4 sm:mb-6">Hubungi via WhatsApp untuk respons lebih cepat.</p>
          <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50">
            <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Hubungi WhatsApp
          </Button>
        </div>
      </section>
    </div>
  )
}
