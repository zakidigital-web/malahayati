'use server'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const headers = request.headers
    const body = await request.json().catch(() => ({}))
    const path = typeof body.path === 'string' && body.path.trim() ? body.path.trim() : request.nextUrl.searchParams.get('path') || '/'
    const referrer = headers.get('referer') || null
    const userAgent = headers.get('user-agent') || null

    await db.analyticsEvent.create({
      data: {
        path,
        referrer,
        userAgent,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics event:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

