import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - List articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')

    const where: {
      category?: string
      featured?: boolean
      published?: boolean
    } = {}
    
    if (category) where.category = category
    if (featured === 'true') where.featured = true
    if (published === 'true') where.published = true

    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: articles,
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST - Create article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, category, author, featured, published, imageUrl, readTime } = body

    if (!title || !slug || !excerpt || !content || !category || !author) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingArticle = await db.article.findUnique({
      where: { slug },
    })

    if (existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      )
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        author,
        featured: featured || false,
        published: published !== false,
        imageUrl,
        readTime: readTime || '5 menit',
      },
    })

    return NextResponse.json({
      success: true,
      data: article,
    })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    )
  }
}

// PUT - Update article
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }

    // If slug is being updated, check for duplicates
    if (data.slug) {
      const existingArticle = await db.article.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      })

      if (existingArticle) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    const article = await db.article.update({
      where: { id },
      data,
    })

    return NextResponse.json({
      success: true,
      data: article,
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE - Delete article
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }

    await db.article.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
