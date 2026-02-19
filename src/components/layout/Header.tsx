'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Home,
  Users,
  Briefcase,
  FileText,
  Phone,
  MessageCircle,
  ChevronRight,
} from 'lucide-react'

interface HeaderProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const navItems = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'about', label: 'Tentang', icon: Users },
  { id: 'services', label: 'Layanan', icon: Briefcase },
  { id: 'articles', label: 'Artikel', icon: FileText },
  { id: 'contact', label: 'Kontak', icon: Phone },
]

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nomorWhatsapp: '',
    email: '',
    jenisPermasalahan: '',
    pesan: '',
  })

  const hasInitialized = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
      toast({ title: 'Gagal', description: 'Terjadi kesalahan.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNavigate = (page: string) => {
    onNavigate(page)
    window.location.hash = page === 'home' ? '' : page
  }

  const handleHashChange = useCallback(() => {
    const hash = window.location.hash.slice(1)
    if (hash && navItems.some(item => item.id === hash)) {
      onNavigate(hash)
    }
  }, [onNavigate])

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [handleHashChange])

  return (
    <>
      {/* Desktop Header - Hidden on mobile */}
      <header className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <button onClick={() => handleNavigate('home')} className="flex items-center gap-3 group">
              <Scale className={`h-8 w-8 transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`} />
              <div className="text-left">
                <h1 className={`text-lg font-semibold tracking-tight transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                  Lembaga Bantuan Hukum Malahayati
                </h1>
                <p className={`text-xs tracking-wider uppercase transition-colors ${isScrolled ? 'text-slate-500' : 'text-white/70'}`}>
                  Solusi Hukum Profesional
                </p>
              </div>
            </button>

            <nav className="flex items-center gap-10">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`text-sm font-medium tracking-wide transition-colors relative group ${
                    isScrolled 
                      ? currentPage === item.id ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                      : currentPage === item.id ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-current transition-all duration-300 ${
                    currentPage === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <a href="tel:+62211234567" className={`hidden xl:flex items-center gap-2 text-sm font-medium transition-colors ${
                isScrolled ? 'text-slate-600' : 'text-white/80 hover:text-white'
              }`}>
                <Phone className="h-4 w-4" />
                <span>+62 21 1234 5678</span>
              </a>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className={`font-medium transition-all ${
                  isScrolled 
                    ? 'bg-amber-500 text-white hover:bg-amber-600' 
                    : 'bg-white text-slate-900 hover:bg-white/90'
                }`}
              >
                Konsultasi Gratis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar - Visible only on mobile/tablet */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="px-4">
          <div className="flex h-16 items-center justify-between">
            <button onClick={() => handleNavigate('home')} className="flex items-center gap-2">
              <Scale className={`h-7 w-7 transition-colors ${isScrolled ? 'text-amber-500' : 'text-white'}`} />
              <div>
                <h1 className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                  Lembaga Bantuan Hukum Malahayati
                </h1>
              </div>
            </button>
            <Button 
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className={`text-xs font-medium transition-all ${
                isScrolled 
                  ? 'bg-amber-500 text-white hover:bg-amber-600' 
                  : 'bg-white/20 backdrop-blur text-white hover:bg-white/30'
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Konsultasi
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Like Android App */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                  isActive ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full transition-colors ${
                  isActive ? 'bg-amber-500' : 'bg-transparent'
                }`} />
                <Icon className={`h-5 w-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Consultation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Konsultasi Gratis</DialogTitle>
            <p className="text-slate-500 text-sm mt-1">Tim kami akan menghubungi Anda dalam 1x24 jam.</p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input id="nama" placeholder="Masukkan nama lengkap" value={formData.namaLengkap}
                onChange={(e) => handleInputChange('namaLengkap', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
              <Input id="whatsapp" placeholder="08123456789" value={formData.nomorWhatsapp}
                onChange={(e) => handleInputChange('nomorWhatsapp', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis Permasalahan</Label>
              <Select value={formData.jenisPermasalahan} onValueChange={(v) => handleInputChange('jenisPermasalahan', v)}>
                <SelectTrigger><SelectValue placeholder="Pilih jenis" /></SelectTrigger>
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
              <Label htmlFor="pesan">Pesan</Label>
              <Textarea id="pesan" placeholder="Jelaskan permasalahan Anda..." rows={3}
                value={formData.pesan} onChange={(e) => handleInputChange('pesan', e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
              {!isSubmitting && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </>
  )
}
