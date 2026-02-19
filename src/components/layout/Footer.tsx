'use client'

import { Scale, MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

interface FooterProps {
  onNavigate?: (page: string) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const handleNavigate = (page: string) => {
    const fn = onNavigate ?? (() => {})
    fn(page)
    window.location.hash = page === 'home' ? '' : page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <button onClick={() => handleNavigate('home')} className="flex items-center gap-3 mb-6 group">
              <Scale className="h-8 w-8 text-amber-400" />
              <div className="text-left">
                <h3 className="text-lg font-semibold">Lembaga Bantuan Hukum Malahayati</h3>
                <p className="text-xs text-slate-400 tracking-wider uppercase">
                  Solusi Hukum Profesional
                </p>
              </div>
            </button>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Memberikan layanan hukum profesional, transparan, dan terpercaya untuk masyarakat Indonesia sejak 2005.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Navigasi</h4>
            <ul className="space-y-3">
              {[
                { id: 'home', label: 'Beranda' },
                { id: 'about', label: 'Tentang Kami' },
                { id: 'services', label: 'Layanan' },
                { id: 'articles', label: 'Artikel' },
                { id: 'contact', label: 'Kontak' },
              ].map((item) => (
                <li key={item.id}>
                  <button onClick={() => handleNavigate(item.id)} className="text-slate-400 hover:text-amber-400 transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Layanan</h4>
            <ul className="space-y-3 text-slate-400">
              <li>Konsultasi Hukum</li>
              <li>Perkara Pidana</li>
              <li>Sengketa Perdata</li>
              <li>Dokumen Hukum</li>
              <li>Mediasi & Negosiasi</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Kontak</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>Perumahan Candra Kirana Asri Blok C1 Kertosari</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span>+1 417 6308853</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span>ykbhmalahayati@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span>Senin – Jumat, 08.00 – 17.00 WIB</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© {currentYear} Lembaga Bantuan Hukum Malahayati. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
