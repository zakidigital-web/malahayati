import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '50')
    const featured = searchParams.get('featured')

    // Get single article by ID or slug
    if (id || slug) {
      const where = id ? { id } : { slug }
      const article = await db.article.findUnique({
        where,
      })
      
      if (!article) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true, data: article })
    }

    // Get list of articles
    const where: { featured?: boolean; published: boolean } = { published: true }
    if (featured === 'true') where.featured = true

    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ success: true, data: articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch articles' }, { status: 500 })
  }
}
