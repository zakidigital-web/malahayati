import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export const dynamic = 'force-dynamic'

function getEnv() {
  const email = process.env.GDRIVE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const keyRaw = process.env.GDRIVE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || ''
  const key = keyRaw.replace(/\\n/g, '\n')
  return { email, key }
}

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
  } catch {
    // not a URL
  }
  return null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const idParam = searchParams.get('id')
  const id = getIdFromAnything(idParam)
  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 })
  }

  const { email, key } = getEnv()
  if (!email || !key) {
    // Best-effort fallback to public URL if no credentials configured
    const publicUrl = `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`
    return NextResponse.redirect(publicUrl, { status: 302 })
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })
    const drive = google.drive({ version: 'v3', auth })

    // Get mime type first
    const meta = await drive.files.get({ fileId: id, fields: 'mimeType, name' })
    const mime = meta.data.mimeType || 'application/octet-stream'

    // Stream file bytes
    const data = await drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'arraybuffer' as any }
    )
    const raw: unknown = (data as any).data
    let payload: Uint8Array
    if (raw instanceof ArrayBuffer) {
      payload = new Uint8Array(raw)
    } else if (ArrayBuffer.isView(raw)) {
      const view = raw as ArrayBufferView
      payload = new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(raw)) {
      payload = new Uint8Array(raw as Buffer)
    } else if (typeof raw === 'string') {
      payload = new TextEncoder().encode(raw)
    } else {
      payload = new Uint8Array()
    }

    const sliced =
      payload.byteOffset === 0 && payload.byteLength === payload.buffer.byteLength
        ? payload.buffer
        : payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength)
    const arrBuf = sliced as unknown as ArrayBuffer
    const blob = new Blob([arrBuf], { type: mime })
    return new NextResponse(blob, {
      headers: {
        'content-type': mime,
        'cache-control': 'public, max-age=86400, immutable',
      },
    })
  } catch (err) {
    console.error('drive-image error:', err)
    // Fallback: redirect to public UC link in case of permission or other API errors
    const publicUrl = `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`
    return NextResponse.redirect(publicUrl, { status: 302 })
  }
}
