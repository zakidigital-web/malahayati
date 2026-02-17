'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
  Menu,
  X,
  ChevronRight,
  Phone,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/services', label: 'Layanan' },
  { href: '/articles', label: 'Artikel' },
  { href: '/contact', label: 'Kontak' },
]

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pathname = usePathname()
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Berhasil!',
          description: 'Permintaan konsultasi Anda telah terkirim. Tim kami akan menghubungi Anda dalam 1x24 jam.',
        })
        setFormData({
          namaLengkap: '',
          nomorWhatsapp: '',
          email: '',
          jenisPermasalahan: '',
          pesan: '',
        })
        setIsDialogOpen(false)
      } else {
        throw new Error(result.error || 'Terjadi kesalahan')
      }
    } catch {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-100">
      {/* Top bar */}
      <div className="bg-slate-900 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              +62 21 1234 5678
            </span>
            <span className="text-slate-400">|</span>
            <span>Senin - Jumat, 08.00 - 17.00 WIB</span>
          </div>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Hubungi Kami
          </Link>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Lembaga Bantuan Hukum Malahayati</h1>
              <p className="text-xs text-slate-500 tracking-wide">
                SOLUSI HUKUM PROFESIONAL DAN TERPERCAYA
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-slate-800">
                  Konsultasi Gratis
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Konsultasi Sekarang</DialogTitle>
                  <DialogDescription className="text-base">
                    Silakan isi form di bawah ini. Tim kami akan merespons dalam waktu 1x24 jam.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input
                      id="nama"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.namaLengkap}
                      onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      placeholder="Contoh: 08123456789"
                      value={formData.nomorWhatsapp}
                      onChange={(e) => handleInputChange('nomorWhatsapp', e.target.value)}
                      required
                    />
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
                      rows={4}
                      value={formData.pesan}
                      onChange={(e) => handleInputChange('pesan', e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isSubmitting}>
                    {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan Konsultasi'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-slate-100">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-2 bg-slate-900 hover:bg-slate-800" onClick={() => setIsMenuOpen(false)}>
                    Konsultasi Gratis
                  </Button>
                </DialogTrigger>
              </Dialog>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
