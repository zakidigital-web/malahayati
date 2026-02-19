'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  Users,
  Scale,
  LogOut,
  Menu,
  X,
  Globe,
  Image,
  Database,
  KeyRound,
  BarChart2,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Hero Slider', href: '/admin/slides', icon: Image },
  { name: 'Artikel', href: '/admin/articles', icon: FileText },
  { name: 'Konsultasi', href: '/admin/consultations', icon: MessageSquare },
  { name: 'Tim', href: '/admin/team', icon: Users },
  { name: 'Testimoni', href: '/admin/testimonials', icon: Users },
  { name: 'Layanan', href: '/admin/services', icon: Scale },
  { name: 'Analitik & SEO', href: '/admin/analytics', icon: BarChart2 },
  { name: 'Database', href: '/admin/database', icon: Database },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  username?: string
}

export default function AdminSidebar({ username }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if ((await response.json()).success) {
        toast({ title: 'Berhasil keluar!' })
        router.push('/auth/login')
        router.refresh()
      }
    } catch (error) {
      toast({ title: 'Gagal keluar', variant: 'destructive' })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b h-16 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="flex items-center gap-2 ml-3">
          <Scale className="h-6 w-6 text-amber-600" />
          <span className="font-semibold">Admin Panel</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white transition-transform duration-300',
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
          <Scale className="h-8 w-8 text-amber-500" />
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-slate-400">Lembaga Bantuan Hukum Malahayati</p>
          </div>
        </div>

        {/* User Info */}
        {username && (
          <div className="px-6 py-3 border-b border-slate-800 bg-slate-800/50">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate">{username}</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
          <Link
            href="/"
            target="_blank"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors mb-2"
          >
            <Globe className="h-5 w-5" />
            <span className="font-medium">Lihat Website</span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors w-full disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
