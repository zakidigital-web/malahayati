'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Save, Settings, Phone, Mail, MapPin, Clock, Globe, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react'

interface Setting {
  id: string
  key: string
  value: string
  type: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const defaultSettings = {
    site_name: 'Lembaga Bantuan Hukum Malahayati',
    site_tagline: 'Solusi Hukum Profesional dan Terpercaya',
    phone: '+62 21 1234 5678',
    whatsapp: '+62 812 3456 7890',
    email: 'ykbhmalahayati@gmail.com',
    address: 'Perumahan Candra Kirana Asri Blok C1 Kertosari',
    hours: 'Senin – Jumat, 08.00 – 17.00 WIB',
    hero_title: 'Pendampingan Hukum Profesional & Terpercaya',
    hero_description: 'Kami memberikan solusi hukum yang komprehensif untuk individu dan perusahaan.',
  }

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const result = await response.json()
      if (result.success) {
        const settingsMap: Record<string, string> = { ...defaultSettings }
        result.data.forEach((s: Setting) => {
          settingsMap[s.key] = s.value
        })
        setSettings(settingsMap)
      }
    } catch (error) {
      console.error('Error:', error)
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: 'Berhasil!', description: 'Pengaturan berhasil disimpan' })
      } else throw new Error(result.error)
    } catch (error) {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Password baru tidak cocok', variant: 'destructive' })
      return
    }
    
    if (newPassword.length < 6) {
      toast({ title: 'Error', description: 'Password minimal 6 karakter', variant: 'destructive' })
      return
    }
    
    setChangingPassword(true)
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      const result = await response.json()
      
      if (result.success) {
        toast({ title: 'Berhasil!', description: 'Password berhasil diubah' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast({ title: 'Gagal', description: result.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan', variant: 'destructive' })
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-400">Memuat...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Pengaturan Website</h1>
          <p className="text-slate-500 mt-1">Konfigurasi informasi dan tampilan website</p>
        </div>
        <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Simpan
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-amber-500" /> Ubah Password</CardTitle>
            <CardDescription>Ganti password admin untuk keamanan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Password Lama</Label>
                  <div className="relative">
                    <Input 
                      type={showCurrentPassword ? 'text' : 'password'} 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Password Baru</Label>
                  <div className="relative">
                    <Input 
                      type={showNewPassword ? 'text' : 'password'} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Konfirmasi Password</Label>
                  <Input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <Button type="submit" variant="outline" disabled={changingPassword}>
                {changingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mengubah...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 mr-2" />
                    Ubah Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Site Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-amber-500" /> Informasi Website</CardTitle>
            <CardDescription>Pengaturan dasar website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Website</Label><Input value={settings.site_name || ''} onChange={(e) => handleInputChange('site_name', e.target.value)} /></div>
              <div className="space-y-2"><Label>Tagline</Label><Input value={settings.site_tagline || ''} onChange={(e) => handleInputChange('site_tagline', e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-amber-500" /> Hero Section</CardTitle>
            <CardDescription>Konten bagian utama halaman beranda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Judul Hero</Label><Input value={settings.hero_title || ''} onChange={(e) => handleInputChange('hero_title', e.target.value)} /></div>
            <div className="space-y-2"><Label>Deskripsi Hero</Label><Textarea value={settings.hero_description || ''} onChange={(e) => handleInputChange('hero_description', e.target.value)} rows={3} /></div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5 text-amber-500" /> Kontak</CardTitle>
            <CardDescription>Informasi kontak yang ditampilkan di website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Telepon</Label><Input value={settings.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> WhatsApp</Label><Input value={settings.whatsapp || ''} onChange={(e) => handleInputChange('whatsapp', e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label><Input type="email" value={settings.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Alamat</Label><Textarea value={settings.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} rows={2} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Jam Operasional</Label><Input value={settings.hours || ''} onChange={(e) => handleInputChange('hours', e.target.value)} /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
