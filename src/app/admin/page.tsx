'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  MessageSquare,
  Users,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

interface Stats {
  articles: number
  consultations: number
  pendingConsultations: number
  teamMembers: number
}

interface RecentConsultation {
  id: string
  namaLengkap: string
  jenisPermasalahan: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    articles: 0,
    consultations: 0,
    pendingConsultations: 0,
    teamMembers: 0,
  })
  const [recentConsultations, setRecentConsultations] = useState<RecentConsultation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, consultationsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/consultations?limit=5'),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (consultationsRes.ok) {
        const consultationsData = await consultationsRes.json()
        setRecentConsultations(consultationsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'contacted':
        return <Badge variant="default" className="bg-blue-500">Dihubungi</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Selesai</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang di panel admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Artikel</CardTitle>
            <FileText className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold">{stats.articles}</div>
            <p className="text-xs text-slate-400 mt-1">Artikel dipublikasikan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Konsultasi</CardTitle>
            <MessageSquare className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold">{stats.consultations}</div>
            <p className="text-xs text-slate-400 mt-1">Total permintaan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold">{stats.pendingConsultations}</div>
            <p className="text-xs text-slate-400 mt-1">Menunggu respons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Tim</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-slate-400 mt-1">Anggota aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href="/admin/articles/create"
              className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <FileText className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-amber-700">Buat Artikel</span>
            </a>
            <a
              href="/admin/consultations"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-700">Lihat Konsultasi</span>
            </a>
            <a
              href="/admin/team"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Users className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-700">Kelola Tim</span>
            </a>
            <a
              href="/admin/settings"
              className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Users className="h-5 w-5 text-slate-600" />
              <span className="font-medium text-slate-700">Pengaturan</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Consultations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Konsultasi Terbaru</CardTitle>
          <a href="/admin/consultations" className="text-sm text-amber-600 hover:text-amber-700">
            Lihat Semua
          </a>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400">Memuat data...</div>
          ) : recentConsultations.length === 0 ? (
            <div className="text-center py-8 text-slate-400">Belum ada konsultasi</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-500">Nama</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 hidden sm:table-cell">Permasalahan</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-500">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-500 hidden md:table-cell">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentConsultations.map((consultation) => (
                    <tr key={consultation.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-3 px-2">
                        <div className="font-medium">{consultation.namaLengkap}</div>
                      </td>
                      <td className="py-3 px-2 hidden sm:table-cell">
                        <span className="text-sm text-slate-600">{consultation.jenisPermasalahan}</span>
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(consultation.status)}
                      </td>
                      <td className="py-3 px-2 hidden md:table-cell">
                        <span className="text-sm text-slate-500">{formatDate(consultation.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
