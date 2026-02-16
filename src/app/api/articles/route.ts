import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '50')
    const featured = searchParams.get('featured')

    // Get single article by ID or slug
    if (id) {
      const article = await db.article.findUnique({ where: { id } })
      if (!article) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })
      }
      return NextResponse.json({ success: true, data: article }, { headers: { 'Cache-Control': 'no-store' } })
    }

    if (slug) {
      const article = await db.article.findUnique({ where: { slug } })
      
      if (!article) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })
      }
      
      return NextResponse.json({ success: true, data: article }, { headers: { 'Cache-Control': 'no-store' } })
    }

    // Get list of articles
    const where: { featured?: boolean; published: boolean } = { published: true }
    if (featured === 'true') where.featured = true

    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ success: true, data: articles }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch articles' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}
