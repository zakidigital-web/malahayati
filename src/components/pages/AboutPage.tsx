'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Scale, Users, CheckCircle2, Award, GraduationCap, Target, Heart, ArrowRight,
} from 'lucide-react'

interface TeamMember {
  id?: string
  name: string
  role: string
  description?: string
  education?: string
  active?: boolean
  order?: number
}

const values = [
  { icon: Award, title: 'Integritas', desc: 'Kejujuran dalam setiap tindakan.' },
  { icon: Target, title: 'Profesionalisme', desc: 'Standar layanan tertinggi.' },
  { icon: Heart, title: 'Empati', desc: 'Memahami kebutuhan klien.' },
  { icon: Scale, title: 'Keadilan', desc: 'Berjuang untuk keadilan.' },
]

const milestones = [
  { year: '2022', title: 'Pendirian', desc: 'YKBH Malahayati didirikan' },
  { year: '2023', title: 'Operasional', desc: 'Mulai melayani masyarakat' },
  { year: '2025', title: 'Capaian', desc: '3 tahun beroperasi di Banyuwangi' },
]

const organization = [
  { role: 'Penasehat', name: 'Slamet Yadi' },
  { role: 'Pengawas', name: 'Heru Setiawan, S.Pd.' },
  { role: 'Ketua', name: 'Firman Febri Cahyana, S.H., C.MSP' },
  { role: 'Wakil Ketua', name: 'Moh. Rifki, S.H.' },
  { role: 'Sekretaris', name: 'Vivi Anjarwati, S.Pd.' },
  { role: 'Bendahara', name: 'Yasmin Nanda Aditama, S.H.' },
  { role: 'Wakil Bendahara', name: 'Wiyanda Nindi Aditama, A.Md.' },
]

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/admin/team', { cache: 'no-store' })
        const json = await res.json()
        if (json?.success && Array.isArray(json.data) && json.data.length) {
          const items = json.data
            .filter((m: any) => m.active !== false)
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((m: any) => ({ name: m.name, role: m.role, description: m.description, education: m.education }))
          if (items.length) setTeamMembers(items)
        }
      } catch {}
    }
    fetchTeam()
  }, [])

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-amber-400 text-xs sm:text-sm font-medium tracking-widest uppercase mb-4 sm:mb-6">
              Tentang Kami
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Mengenal Lebih Dekat
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                YKBH Malahayati
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed">
              YKBH Malahayati didirikan pada tahun 2022 dengan visi memberikan akses keadilan yang setara bagi seluruh lapisan masyarakat. Selama 3 tahun beroperasi, kami telah menjadi mitra terpercaya dalam penyelesaian berbagai permasalahan hukum di wilayah Banyuwangi dan sekitarnya.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
                Sejarah Kami
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
                Perjalanan Kami
              </h2>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6">
                Sejak 2022, kami berkomitmen menjadi mitra terpercaya dalam penyelesaian permasalahan hukum, khususnya bagi masyarakat Banyuwangi dan sekitarnya.
              </p>
              <Button className="bg-slate-900 hover:bg-slate-800">
                Hubungi Kami <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Scale className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
              Struktur Organisasi
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Yayasan Konsultasi dan Bantuan Hukum Malahayati
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {teamMembers.map((item, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
                    <div className="text-amber-700 font-semibold text-sm sm:text-base">{item.role}</div>
                  </div>
                  <div className="text-slate-900 text-base sm:text-lg font-bold">{item.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
              Milestone
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Perjalanan Kami
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex flex-col items-center text-center w-24 sm:w-28 lg:w-32">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-amber-500 text-white flex items-center justify-center text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-4">
                  {m.year.slice(2)}
                </div>
                <div className="text-slate-900 font-semibold text-sm sm:text-base">{m.title}</div>
                <div className="text-slate-500 text-xs sm:text-sm">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardHeader className="p-4 sm:p-6">
                <Scale className="h-8 w-8 sm:h-10 sm:w-10 text-amber-400 mb-3 sm:mb-4" />
                <CardTitle className="text-xl sm:text-2xl">Visi</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Menjadi lembaga hukum terpercaya yang memberikan solusi hukum adil.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-slate-50">
              <CardHeader className="p-4 sm:p-6">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-amber-600 mb-3 sm:mb-4" />
                <CardTitle className="text-xl sm:text-2xl">Misi</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ul className="space-y-2 sm:space-y-3">
                  {['Layanan profesional', 'Menjaga kerahasiaan klien', 'Solusi jelas & terukur', 'Akses masyarakat luas'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <p className="text-amber-400 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
              Nilai-Nilai Kami
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Fondasi Layanan Kami
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2">{v.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm lg:text-base">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <p className="text-amber-600 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 sm:mb-4">
              Tim Kami
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Profesional Berpengalaman
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
            {teamMembers.map((member, i) => (
              <Card key={i} className="border-0 bg-slate-50 hover:shadow-lg transition-shadow group text-center">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white text-lg sm:text-xl lg:text-2xl font-bold group-hover:scale-105 transition-transform">
                    {member.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-xs sm:text-sm lg:text-lg mb-1">{member.name}</CardTitle>
                  <CardDescription className="text-amber-600 font-medium text-[10px] sm:text-xs lg:text-sm mb-2">{member.role}</CardDescription>
                  <p className="text-slate-600 text-[10px] sm:text-xs lg:text-sm hidden sm:block">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            {[
              { n: '20+', l: 'Tahun Pengalaman' },
              { n: '5000+', l: 'Klien Terlayani' },
              { n: '15+', l: 'Advokat Profesional' },
              { n: '98%', l: 'Tingkat Kepuasan' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">{s.n}</div>
                <div className="text-amber-100 text-xs sm:text-sm lg:text-base">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
