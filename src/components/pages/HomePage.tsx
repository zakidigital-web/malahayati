'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Scale,
  FileText,
  Users,
  MessageSquare,
  HandshakeIcon,
  Shield,
  Clock,
  Lock,
  Award,
  ChevronRight,
  CheckCircle2,
  Gavel,
  ArrowRight,
  Star,
} from 'lucide-react'
import HeroSlider from './HeroSlider'

interface HomePageProps {
  onNavigate: (page: string) => void
}

const services = [
  { icon: MessageSquare, title: 'Konsultasi Hukum', desc: 'Arahan dan solusi untuk permasalahan hukum Anda.' },
  { icon: Shield, title: 'Perkara Pidana', desc: 'Pendampingan dari penyidikan hingga persidangan.' },
  { icon: Gavel, title: 'Sengketa Perdata', desc: 'Penanganan litigasi dan non-litigasi.' },
  { icon: FileText, title: 'Dokumen Hukum', desc: 'Penyusunan kontrak dan perjanjian profesional.' },
  { icon: HandshakeIcon, title: 'Mediasi', desc: 'Penyelesaian melalui musyawarah.' },
]

const stats = [
  { number: '3+', label: 'Tahun Mendampingi' },
  { number: '200+', label: 'Klien Terlayani' },
  { number: '95%', label: 'Kepuasan Klien' },
  { number: '8+', label: 'Tim Hukum & Paralegal' },
]

interface Testimonial {
  id?: string
  name: string
  role: string
  content: string
  rating: number
  active?: boolean
  order?: number
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [showConsultDialog, setShowConsultDialog] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { name: 'Ahmad Santoso', role: 'Pengusaha', content: 'Pelayanan sangat profesional. Saya terbantu menyelesaikan sengketa bisnis dengan baik.', rating: 5 },
    { name: 'Siti Rahayu', role: 'Manager HR', content: 'Tim advokat sangat sabar menjelaskan proses hukum yang rumit.', rating: 5 },
    { name: 'Budi Prasetyo', role: 'Direktur PT', content: 'Penyusunan kontrak kerja sama sangat detail.', rating: 5 },
  ])

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/admin/testimonials', { cache: 'no-store' })
        const json = await res.json()
        if (json?.success && Array.isArray(json.data) && json.data.length) {
          const items = json.data
            .filter((t: any) => t.active !== false)
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((t: any) => ({ name: t.name, role: t.role, content: t.content, rating: t.rating ?? 5 }))
          if (items.length) setTestimonials(items)
        }
      } catch {}
    }
    fetchTestimonials()
  }, [])

  const handleNavigate = (page: string) => {
    onNavigate(page)
    window.location.hash = page === 'home' ? '' : page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Hero Slider */}
      <HeroSlider onConsultClick={() => setShowConsultDialog(true)} />

      {/* Stats Section */}
      <section className="relative -mt-12 sm:-mt-16 lg:-mt-20 z-20 pb-12 sm:pb-16 lg:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-slate-500 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
                Tentang Kami
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                YKBH Malahayati Banyuwangi
                <span className="text-amber-600"> — Akses Keadilan untuk Semua</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6">
                Berdiri sejak 2022 di Banyuwangi, kami berkomitmen memberikan pendampingan dan
                solusi hukum yang mudah diakses, profesional, dan berpihak pada keadilan.
              </p>
              <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
                {['Profesional & berpengalaman', 'Transparan dalam proses dan biaya', 'Kerahasiaan klien terjaga', 'Respons cepat & komunikatif'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-slate-700 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => handleNavigate('about')} variant="outline" className="group">
                Selengkapnya
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl sm:rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Scale className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 text-slate-400" />
                </div>
              </div>
              <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 bg-amber-500 text-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-xl">
                <div className="text-2xl sm:text-3xl font-bold">3+</div>
                <div className="text-amber-100 text-xs sm:text-sm">Tahun Mendampingi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
              Layanan Kami
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Solusi Hukum Komprehensif
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4">
              Kami menyediakan berbagai layanan hukum untuk memenuhi kebutuhan Anda.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="group hover:shadow-lg sm:hover:shadow-xl transition-all border-0 bg-slate-50 hover:bg-white">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                    </div>
                    <CardTitle className="text-base sm:text-lg lg:text-xl group-hover:text-amber-600 transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <CardDescription className="text-xs sm:text-sm lg:text-base">{service.desc}</CardDescription>
                    <button className="mt-3 sm:mt-4 text-amber-600 font-medium text-xs sm:text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      Pelajari <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button onClick={() => handleNavigate('services')} size="lg" className="bg-slate-900 hover:bg-slate-800">
              Lihat Semua Layanan
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-amber-400 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
                Mengapa Memilih Kami
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                Komitmen Kami untuk Keberhasilan Anda
              </h2>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
                Sejak 2022, kami telah membantu ratusan klien di Banyuwangi dan sekitarnya
                menyelesaikan permasalahan hukum secara efektif dan manusiawi.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {[
                { icon: Award, title: 'Profesional', desc: 'Tim tersertifikasi' },
                { icon: FileText, title: 'Transparan', desc: 'Biaya jelas' },
                { icon: Lock, title: 'Rahasia', desc: 'Terjamin aman' },
                { icon: Clock, title: 'Responsif', desc: 'Cepat tanggap' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="bg-slate-800/50 backdrop-blur p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl hover:bg-slate-800 transition-colors">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-amber-400 mb-2 sm:mb-3 lg:mb-4" />
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
              Testimoni
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Apa Kata Klien Kami
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-white border-0 shadow-md sm:shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-6 italic">&quot;{t.content}&quot;</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm sm:text-base">{t.name}</div>
                      <div className="text-slate-500 text-xs sm:text-sm">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Butuh Konsultasi Hukum?
          </h2>
          <p className="text-amber-100 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Tim kami siap membantu menyelesaikan permasalahan hukum Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 text-base px-6 sm:px-8 py-5 h-auto font-medium w-full sm:w-auto">
              Konsultasi Gratis
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-base px-6 sm:px-8 py-5 h-auto font-medium w-full sm:w-auto"
              onClick={() => handleNavigate('contact')}>
              Hubungi Kami
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <div>
              <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
                Hubungi Kami
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
                Siap Membantu Anda
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {[
                  { icon: Scale, label: 'Alamat', value: 'Perumahan Candra Kirana Asri Blok C1, Kertosari, Banyuwangi' },
                  { icon: MessageSquare, label: 'WA Admin', value: '+62 812-0000-0000' },
                  { icon: FileText, label: 'Email', value: 'ykbhmalahayati@gmail.com' },
                  { icon: Clock, label: 'Jam Kerja', value: 'Senin–Jumat, 08.00–16.00' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs sm:text-sm">{item.label}</div>
                        <div className="text-slate-900 font-medium text-sm sm:text-base">{item.value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="bg-slate-100 rounded-xl sm:rounded-2xl h-64 sm:h-80 lg:h-[400px] flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Scale className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">Peta Lokasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
