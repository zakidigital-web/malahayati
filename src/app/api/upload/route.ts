import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { promises as fsp } from 'fs'
import { google } from 'googleapis'
import { Readable } from 'stream'

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
    const storage = (formData.get('storage') as string) || ''

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const type = file.type || ''
    if (!type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Only image uploads are allowed' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const clientEmail = process.env.GDRIVE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = (process.env.GDRIVE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    const driveFolderId = process.env.GDRIVE_FOLDER_ID
    const canUseDrive = !!clientEmail && !!privateKey && !!driveFolderId

    if (storage === 'drive' || (canUseDrive && storage !== 'local')) {
      try {
        const auth = new google.auth.JWT({
          email: clientEmail as string,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/drive.file'],
        })
        const drive = google.drive({ version: 'v3', auth })
        const extFromName = path.extname((file as any).name || '')
        const safeName = sanitizeFileName((file as any).name || `upload${extFromName || '.jpg'}`)
        const fileName = `${Date.now()}-${safeName}`
        const res = await drive.files.create({
          requestBody: {
            name: fileName,
            parents: [driveFolderId as string],
          },
          media: {
            mimeType: type,
            body: Readable.from(buffer),
          },
          fields: 'id',
        })
        const id = res.data.id
        if (!id) throw new Error('No file id')
        await drive.permissions.create({
          fileId: id,
          requestBody: { role: 'reader', type: 'anyone' },
        })
        const url = `https://drive.google.com/uc?export=view&id=${id}`
        return NextResponse.json({ success: true, url, provider: 'gdrive', id })
      } catch (err) {
        console.error('Drive upload failed, falling back to local:', err)
      }
    }

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
    return NextResponse.json({ success: true, url, provider: 'local' })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 })
  }
}
