import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function getPeriodFromRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const daysParam = searchParams.get('days')
  const days = daysParam ? Math.max(1, Math.min(365, parseInt(daysParam, 10) || 30)) : 30
  const to = new Date()
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
  return { from, to, days }
}

export async function GET(request: NextRequest) {
  try {
    const { from, to, days } = getPeriodFromRequest(request)

    const [totalEvents, pageStats, referrerStats, articles] = await Promise.all([
      db.analyticsEvent.count({
        where: { createdAt: { gte: from, lte: to } },
      }),
      db.analyticsEvent.groupBy({
        by: ['path'],
        where: { createdAt: { gte: from, lte: to } },
        _count: { _all: true },
        orderBy: { _count: { _all: 'desc' } },
      }),
      db.analyticsEvent.groupBy({
        by: ['referrer'],
        where: { createdAt: { gte: from, lte: to } },
        _count: { _all: true },
        orderBy: { _count: { _all: 'desc' } },
      }),
      db.article.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const totalArticles = articles.length
    const publishedArticles = articles.filter((a) => a.published).length
    const withImage = articles.filter((a) => !!a.imageUrl).length
    const withoutImage = totalArticles - withImage
    const avgTitleLength =
      totalArticles === 0
        ? 0
        : Math.round(
            articles.reduce((sum, a) => sum + (a.title?.length || 0), 0) / totalArticles
          )
    const avgExcerptLength =
      totalArticles === 0
        ? 0
        : Math.round(
            articles.reduce((sum, a) => sum + (a.excerpt?.length || 0), 0) / totalArticles
          )

    const formatDate = (d: Date) =>
      d.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

    const lines: string[] = []
    lines.push('Laporan Analitik & SEO Website YKBH Malahayati')
    lines.push(`Periode;${formatDate(from)};${formatDate(to)} (±${days} hari)`)
    lines.push(`Dibuat pada;${formatDate(new Date())}`)
    lines.push('')

    lines.push('Ringkasan Trafik')
    lines.push('Metrix;Nilai')
    lines.push(`Total Page Views;${totalEvents}`)
    lines.push('')

    lines.push('Ringkasan SEO Artikel')
    lines.push('Metrix;Nilai')
    lines.push(`Total Artikel;${totalArticles}`)
    lines.push(`Artikel Dipublikasikan;${publishedArticles}`)
    lines.push(`Artikel dengan Gambar;${withImage}`)
    lines.push(`Artikel tanpa Gambar;${withoutImage}`)
    lines.push(`Rata-rata Panjang Judul;${avgTitleLength} karakter`)
    lines.push(`Rata-rata Panjang Ringkasan;${avgExcerptLength} karakter`)
    lines.push('')

    lines.push('Statistik Halaman')
    lines.push('No;Halaman;Page Views')
    pageStats.forEach((p, index) => {
      lines.push(`${index + 1};${p.path};${p._count._all}`)
    })
    lines.push('')

    lines.push('Sumber Trafik (Referrer)')
    lines.push('No;Sumber;Page Views')
    referrerStats
      .filter((r) => r.referrer)
      .forEach((r, index) => {
        lines.push(`${index + 1};${r.referrer};${r._count._all}`)
      })
    lines.push('')

    lines.push('Detail Artikel untuk SEO')
    lines.push(
      [
        'No',
        'Judul',
        'Slug',
        'Dipublikasikan',
        'Memiliki Gambar',
        'Panjang Judul',
        'Panjang Ringkasan',
        'Tanggal Dibuat',
      ].join(';')
    )
    articles.forEach((a, index) => {
      lines.push(
        [
          index + 1,
          `"${(a.title || '').replace(/"/g, '""')}"`,
          a.slug,
          a.published ? 'Ya' : 'Tidak',
          a.imageUrl ? 'Ya' : 'Tidak',
          a.title?.length || 0,
          a.excerpt?.length || 0,
          formatDate(a.createdAt),
        ].join(';')
      )
    })

    const csv = lines.join('\r\n')
    const fileName = `laporan-analitik-seo-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting analytics report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export analytics report' },
      { status: 500 }
    )
  }
}

