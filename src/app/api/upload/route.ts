import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { promises as fsp } from 'fs'

export const dynamic = 'force-dynamic'

function sanitizeFileName(name: string) {
  const base = path.basename(name)
  return base.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'team'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const type = file.type || ''
    if (!type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Only image uploads are allowed' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder)
    await fsp.mkdir(uploadsDir, { recursive: true })

    const extFromName = path.extname((file as any).name || '') || ''
    const safeName = sanitizeFileName((file as any).name || `upload${extFromName || '.jpg'}`)
    const fileName = `${Date.now()}-${safeName}`
    const filePath = path.join(uploadsDir, fileName)

    await fsp.writeFile(filePath, buffer)

    // Ensure file is readable (Windows sometimes needs permission checks)
    try { fs.accessSync(filePath, fs.constants.R_OK) } catch {}

    const url = `/uploads/${folder}/${fileName}`
    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 })
  }
}
