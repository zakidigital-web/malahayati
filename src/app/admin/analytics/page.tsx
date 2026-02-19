'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart2, FileDown, Globe2, Search } from 'lucide-react'

interface TrafficByPage {
  path: string
  pageViews: number
}

interface TrafficByReferrer {
  referrer: string
  pageViews: number
}

interface SeoArticle {
  id: string
  title: string
  slug: string
  published: boolean
  hasImage: boolean
  titleLength: number
  excerptLength: number
  createdAt: string
}

interface AnalyticsData {
  period: {
    from: string
    to: string
    days: number
  }
  traffic: {
    totalPageViews: number
    byPage: TrafficByPage[]
    byReferrer: TrafficByReferrer[]
  }
  seo: {
    totalArticles: number
    publishedArticles: number
    withImage: number
    withoutImage: number
    avgTitleLength: number
    avgExcerptLength: number
    articles: SeoArticle[]
  }
}

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/analytics?days=${days}`)
        const json = await res.json()
        if (json?.success) {
          setData({
            period: {
              from: json.data.period.from,
              to: json.data.period.to,
              days: json.data.period.days,
            },
            traffic: json.data.traffic,
            seo: json.data.seo,
          })
        }
      } catch (error) {
        console.error('Failed to load analytics', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [days])

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch(`/api/admin/analytics/export?days=${days}`)
      if (!res.ok) return
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `laporan-analitik-seo-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export analytics report', error)
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (value: string | undefined) => {
    if (!value) return '-'
    const d = new Date(value)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Analitik & SEO</h1>
          <p className="text-slate-500 mt-1">
            Pantau performa pengunjung dan kesehatan SEO website dalam satu tampilan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Periode</span>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white"
            >
              <option value={7}>7 hari</option>
              <option value={30}>30 hari</option>
              <option value={90}>90 hari</option>
              <option value={180}>180 hari</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Memproses...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Export Laporan
              </>
            )}
          </Button>
        </div>
      </div>

      {data && (
        <p className="text-xs text-slate-500">
          Periode data:{' '}
          <span className="font-medium">
            {formatDate(data.period.from)} - {formatDate(data.period.to)}
          </span>{' '}
          ({data.period.days} hari)
        </p>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Page Views
            </CardTitle>
            <BarChart2 className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold">
              {loading ? '-' : data?.traffic.totalPageViews ?? 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">Seluruh halaman</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Artikel Dipublikasikan
            </CardTitle>
            <Search className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold">
              {loading ? '-' : data?.seo.publishedArticles ?? 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">Siap diindeks mesin pencari</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Artikel tanpa Gambar
            </CardTitle>
            <Globe2 className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold">
              {loading ? '-' : data?.seo.withoutImage ?? 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">Perlu dilengkapi visual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Rata-rata Judul
            </CardTitle>
            <Search className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold">
              {loading ? '-' : `${data?.seo.avgTitleLength ?? 0}`}
            </div>
            <p className="text-xs text-slate-400 mt-1">Karakter per judul artikel</p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic by page & referrer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-amber-500" />
              Trafik per Halaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-slate-400 py-6 text-sm">
                Memuat data...
              </div>
            ) : !data || data.traffic.byPage.length === 0 ? (
              <div className="text-center text-slate-400 py-6 text-sm">
                Belum ada data kunjungan.
              </div>
            ) : (
              <div className="space-y-3">
                {data.traffic.byPage.map((item) => (
                  <div key={item.path} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm font-medium text-slate-800">
                        {item.path}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.pageViews}x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-blue-500" />
              Sumber Trafik (Referrer)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-slate-400 py-6 text-sm">
                Memuat data...
              </div>
            ) : !data || data.traffic.byReferrer.length === 0 ? (
              <div className="text-center text-slate-400 py-6 text-sm">
                Belum ada data sumber trafik.
              </div>
            ) : (
              <div className="space-y-3">
                {data.traffic.byReferrer.map((item) => (
                  <div key={item.referrer} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium text-slate-800 truncate max-w-[220px]">
                        {item.referrer}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.pageViews}x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SEO Articles table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-700" />
            Detail Artikel untuk SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-slate-400 py-6 text-sm">
              Memuat data...
            </div>
          ) : !data || data.seo.articles.length === 0 ? (
            <div className="text-center text-slate-400 py-6 text-sm">
              Belum ada artikel yang tercatat.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-2 px-2 font-medium text-slate-500">
                      Judul
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500">
                      Status
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500">
                      Gambar
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500">
                      Panjang Judul
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500">
                      Panjang Ringkasan
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-slate-500">
                      Dibuat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.seo.articles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="py-2 px-2">
                        <div className="font-medium text-slate-900 truncate max-w-[260px]">
                          {article.title}
                        </div>
                        <div className="text-xs text-slate-400">{article.slug}</div>
                      </td>
                      <td className="py-2 px-2">
                        <Badge
                          variant={article.published ? 'default' : 'secondary'}
                          className={article.published ? 'bg-emerald-500' : ''}
                        >
                          {article.published ? 'Dipublikasikan' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">
                        <Badge
                          variant={article.hasImage ? 'default' : 'secondary'}
                          className={
                            article.hasImage ? 'bg-blue-500' : 'bg-slate-200 text-slate-700'
                          }
                        >
                          {article.hasImage ? 'Lengkap' : 'Belum ada'}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-sm text-slate-800">
                          {article.titleLength} karakter
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-sm text-slate-800">
                          {article.excerptLength} karakter
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-sm text-slate-800">
                          {formatDate(article.createdAt)}
                        </span>
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
