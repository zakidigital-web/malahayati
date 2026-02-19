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
        take: 10,
      }),
      db.analyticsEvent.groupBy({
        by: ['referrer'],
        where: { createdAt: { gte: from, lte: to } },
        _count: { _all: true },
        orderBy: { _count: { _all: 'desc' } },
        take: 10,
      }),
      db.article.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const seoStats = (() => {
      if (!articles.length) {
        return {
          totalArticles: 0,
          publishedArticles: 0,
          withImage: 0,
          withoutImage: 0,
          avgTitleLength: 0,
          avgExcerptLength: 0,
        }
      }
      const totalArticles = articles.length
      const publishedArticles = articles.filter((a) => a.published).length
      const withImage = articles.filter((a) => !!a.imageUrl).length
      const withoutImage = totalArticles - withImage
      const avgTitleLength =
        articles.reduce((sum, a) => sum + (a.title?.length || 0), 0) / totalArticles
      const avgExcerptLength =
        articles.reduce((sum, a) => sum + (a.excerpt?.length || 0), 0) / totalArticles
      return {
        totalArticles,
        publishedArticles,
        withImage,
        withoutImage,
        avgTitleLength: Math.round(avgTitleLength),
        avgExcerptLength: Math.round(avgExcerptLength),
      }
    })()

    return NextResponse.json({
      success: true,
      data: {
        period: {
          from,
          to,
          days,
        },
        traffic: {
          totalPageViews: totalEvents,
          byPage: pageStats.map((p) => ({
            path: p.path,
            pageViews: p._count._all,
          })),
          byReferrer: referrerStats
            .filter((r) => r.referrer)
            .map((r) => ({
              referrer: r.referrer,
              pageViews: r._count._all,
            })),
        },
        seo: {
          ...seoStats,
          articles: articles.slice(0, 50).map((a) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            published: a.published,
            hasImage: !!a.imageUrl,
            titleLength: a.title?.length || 0,
            excerptLength: a.excerpt?.length || 0,
            createdAt: a.createdAt,
          })),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

