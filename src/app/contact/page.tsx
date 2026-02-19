'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Alamat Kantor',
    content: ['Perumahan Candra Kirana Asri Blok C1 Kertosari'],
    action: null,
  },
  {
    icon: Phone,
    title: 'Telepon / WhatsApp',
    content: ['+1 417 6308853 (Telepon / WhatsApp)'],
    action: { label: 'Hubungi', href: 'tel:+14176308853' },
  },
  {
    icon: Mail,
    title: 'Email',
    content: ['ykbhmalahayati@gmail.com'],
    action: { label: 'Kirim Email', href: 'mailto:ykbhmalahayati@gmail.com' },
  },
  {
    icon: Clock,
    title: 'Jam Operasional',
    content: ['Senin – Jumat', '08.00 – 17.00 WIB'],
    action: null,
  },
]

const faqs = [
  {
    question: 'Bagaimana cara mengajukan konsultasi?',
    answer: 'Anda dapat mengajukan konsultasi melalui form di website ini, menghubungi nomor WhatsApp kami, atau datang langsung ke kantor kami pada jam operasional.',
  },
  {
    question: 'Berapa biaya konsultasi awal?',
    answer: 'Kami menyediakan konsultasi awal gratis untuk memahami permasalahan Anda. Biaya lanjutan akan diinformasikan secara transparan setelah analisis kasus.',
  },
  {
    question: 'Apakah konsultasi bisa dilakukan secara online?',
    answer: 'Ya, kami menyediakan layanan konsultasi online melalui video call atau telepon untuk kenyamanan klien yang tidak bisa datang ke kantor.',
  },
  {
    question: 'Bagaimana cara pembayaran jasa hukum?',
    answer: 'Pembayaran dapat dilakukan melalui transfer bank atau secara langsung di kantor. Kami juga menyediakan opsi pembayaran bertahap untuk kasus tertentu.',
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nomorWhatsapp: '',
    email: '',
    jenisPermasalahan: '',
    pesan: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
        toast({ title: 'Berhasil!', description: 'Pesan Anda telah terkirim. Tim kami akan menghubungi Anda dalam 1x24 jam.' })
        setFormData({ namaLengkap: '', nomorWhatsapp: '', email: '', jenisPermasalahan: '', pesan: '' })
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
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Hubungi Kami</span>
              <h1 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
                Kami Siap Membantu Anda
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Hubungi kami untuk konsultasi atau informasi lebih lanjut. Tim kami siap memberikan layanan terbaik untuk menyelesaikan permasalahan hukum Anda.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Information */}
              <div>
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">Informasi Kontak</span>
                <h2 className="text-3xl font-bold mt-2 mb-6">Hubungi Kami Kapan Saja</h2>
                <p className="text-slate-600 mb-8">
                  Kami berkomitmen untuk merespons setiap pertanyaan dalam waktu 1x24 jam.
                </p>

                <div className="space-y-6 mb-8">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{info.title}</h3>
                          {info.content.map((line, idx) => (
                            <p key={idx} className="text-slate-600">{line}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="font-semibold mb-4">Ikuti Kami</h3>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">Kirim Pesan</h3>
                        <p className="text-slate-500 text-sm">Tim kami akan merespons dalam 1x24 jam</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nama">Nama Lengkap</Label>
                          <Input
                            id="nama"
                            placeholder="Nama lengkap Anda"
                            value={formData.namaLengkap}
                            onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                          <Input
                            id="whatsapp"
                            placeholder="08123456789"
                            value={formData.nomorWhatsapp}
                            onChange={(e) => handleInputChange('nomorWhatsapp', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jenis">Jenis Permasalahan</Label>
                        <Select
                          value={formData.jenisPermasalahan}
                          onValueChange={(value) => handleInputChange('jenisPermasalahan', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis permasalahan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pidana">Perkara Pidana</SelectItem>
                            <SelectItem value="perdata">Sengketa Perdata</SelectItem>
                            <SelectItem value="keluarga">Hukum Keluarga</SelectItem>
                            <SelectItem value="bisnis">Hukum Bisnis</SelectItem>
                            <SelectItem value="dokumen">Pembuatan Dokumen Hukum</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pesan">Pesan</Label>
                        <Textarea
                          id="pesan"
                          placeholder="Jelaskan permasalahan hukum Anda..."
                          rows={5}
                          value={formData.pesan}
                          onChange={(e) => handleInputChange('pesan', e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 py-6 text-lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                          'Mengirim...'
                        ) : (
                          <>
                            Kirim Pesan
                            <Send className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Lokasi Kantor</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Temukan Kami</h2>
            </div>
            <Card className="max-w-4xl mx-auto border-0 shadow-lg overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">Perumahan Candra Kirana Asri Blok C1 Kertosari</p>
                  <p className="text-sm text-slate-500 mt-2">Peta lokasi akan ditampilkan di sini</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">FAQ</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Pertanyaan yang Sering Diajukan</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3">{faq.question}</h3>
                    <p className="text-slate-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
