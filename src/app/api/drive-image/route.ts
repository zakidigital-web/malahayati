import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getIdFromAnything(idOrUrl: string | null) {
  if (!idOrUrl) return null
  if (/^[a-zA-Z0-9_-]{10,}$/.test(idOrUrl)) return idOrUrl
  try {
    const u = new URL(idOrUrl)
    if (u.hostname.includes('drive.google.com')) {
      if (u.pathname.includes('/file/d/')) {
        const parts = u.pathname.split('/')
        const idx = parts.findIndex(p => p === 'd')
        if (idx >= 0 && parts[idx + 1]) return parts[idx + 1]
      }
      const idParam = u.searchParams.get('id')
      if (idParam) return idParam
    }
    const candidates = u.pathname.split('/').filter(Boolean).filter(seg => /^[a-zA-Z0-9_-]{10,}$/.test(seg))
    if (candidates.length) return candidates[candidates.length - 1]
  } catch {}
  return null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const idParam = searchParams.get('id')
  const id = getIdFromAnything(idParam)
  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 })
  }

  const publicUrl = `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`
  return NextResponse.redirect(publicUrl, { status: 302 })
}
