import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Scale,
  ArrowRight,
  Award,
  Target,
  Heart,
  Users,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const values = [
  {
    icon: Award,
    title: 'Integritas',
    description: 'Kami menjunjung tinggi kejujuran dan etika profesional dalam setiap tindakan.',
  },
  {
    icon: Target,
    title: 'Profesionalisme',
    description: 'Memberikan layanan dengan standar tertinggi dan keahlian yang teruji.',
  },
  {
    icon: Heart,
    title: 'Empati',
    description: 'Memahami situasi klien dengan penuh pengertian dan memberikan solusi terbaik.',
  },
  {
    icon: Scale,
    title: 'Keadilan',
    description: 'Berjuang untuk keadilan dan hak-hak klien dalam setiap perkara.',
  },
]

const milestones = [
  {
    year: '2022',
    title: 'Pendirian YKBH Malahayati',
    description: 'Didirikan dengan visi memberikan akses keadilan yang setara bagi seluruh lapisan masyarakat.',
  },
  {
    year: '2023',
    title: 'Mulai Operasional',
    description: 'Menjadi mitra terpercaya dalam penyelesaian berbagai permasalahan hukum di Banyuwangi dan sekitarnya.',
  },
  {
    year: '2025',
    title: '3 Tahun Beroperasi',
    description: 'Terus memperluas layanan dan kemitraan untuk mendampingi masyarakat di wilayah Banyuwangi.',
  },
]

export default async function AboutPage() {
  const members = await db.teamMember.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })
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
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Tentang Kami</span>
              <h1 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
                Mengenal Lebih Dekat YKBH Malahayati
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                YKBH Malahayati didirikan pada tahun 2022 dengan visi memberikan akses keadilan yang setara bagi seluruh lapisan masyarakat.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">Sejarah Kami</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Perjalanan Kami</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  YKBH Malahayati berdiri pada tahun 2022 dan selama 3 tahun beroperasi telah menjadi mitra terpercaya
                  dalam penyelesaian berbagai permasalahan hukum di wilayah Banyuwangi dan sekitarnya. Kami hadir untuk
                  memastikan layanan hukum yang berkualitas, mudah diakses, dan berpihak pada keadilan bagi semua.
                </p>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 md:-translate-x-1/2"></div>
                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`relative flex items-center gap-6 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="text-primary font-bold text-2xl mb-2">{milestone.year}</div>
                            <h3 className="font-bold text-lg mb-2">{milestone.title}</h3>
                            <p className="text-slate-600">{milestone.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full md:-translate-x-1/2 ring-4 ring-white shadow-lg z-10"></div>
                      <div className="flex-1 ml-12 md:ml-0 md:hidden">
                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="text-primary font-bold text-2xl mb-2">{milestone.year}</div>
                            <h3 className="font-bold text-lg mb-2">{milestone.title}</h3>
                            <p className="text-slate-600">{milestone.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="flex-1 hidden md:block"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
                    <Scale className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Visi</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Menjadi lembaga hukum yang terpercaya dan memberikan solusi hukum yang adil bagi
                    seluruh lapisan masyarakat Indonesia.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Misi</h3>
                  <ul className="space-y-4">
                    {[
                      'Memberikan layanan hukum yang profesional dan berkualitas tinggi',
                      'Menjaga kerahasiaan dan kepercayaan klien dengan standar tertinggi',
                      'Memberikan solusi hukum yang jelas, terukur, dan efektif',
                      'Meningkatkan akses masyarakat terhadap layanan hukum berkualitas',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Struktur Organisasi</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Yayasan Konsultasi dan Bantuan Hukum Malahayati</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Susunan pengurus inti yayasan.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {members.map((item: any, i: number) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="text-primary font-semibold">{item.role}</div>
                    </div>
                    <div className="text-slate-900 text-lg font-bold">{item.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Nilai-Nilai Kami</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Nilai yang Kami Pegang</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Nilai-nilai fundamental yang menjadi fondasi dalam memberikan layanan hukum
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <Card key={index} className="text-center border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                      <p className="text-slate-600">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Tim Kami</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Tim Profesional Kami</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                Didukung oleh tim advokat dan praktisi hukum berpengalaman yang berkomitmen
                memberikan layanan terbaik
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {members.map((member, index) => (
                <Card key={index} className="group border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <span className="text-white font-bold text-2xl">
                          {member.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                      <p className="text-slate-600 text-sm mb-4">{member.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <GraduationCap className="h-4 w-4" />
                        <span>{(member as any).education}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-5xl font-bold mb-2">20+</div>
                <div className="text-slate-400">Tahun Pengalaman</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">5000+</div>
                <div className="text-slate-400">Klien Terlayani</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">10+</div>
                <div className="text-slate-400">Advokat Profesional</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">98%</div>
                <div className="text-slate-400">Tingkat Kepuasan</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Membantu Anda</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
              Hubungi kami sekarang untuk mendapatkan konsultasi hukum profesional
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-lg px-8 py-6">
                Konsultasi Sekarang
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
