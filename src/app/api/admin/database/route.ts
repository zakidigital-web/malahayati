import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db', 'custom.db')
const BACKUP_DIR = path.join(process.cwd(), 'backups')
const IS_TURSO = Boolean(process.env.TURSO_DATABASE_URL?.startsWith('libsql://'))

// Ensure backup directory exists
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }
}

// GET - List backups
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Tidak terautentikasi' }, { status: 401 })
    }
    if (IS_TURSO) {
      return NextResponse.json({ success: false, error: 'Backup database tidak tersedia saat menggunakan Turso' }, { status: 400 })
    }
    
    ensureBackupDir()
    
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.endsWith('.db'))
      .map(f => {
        const stat = fs.statSync(path.join(BACKUP_DIR, f))
        return {
          name: f,
          size: stat.size,
          createdAt: stat.mtime.toISOString(),
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json({ success: true, data: files })
  } catch (error) {
    console.error('List backups error:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengambil daftar backup' }, { status: 500 })
  }
}

// POST - Create backup
export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Tidak terautentikasi' }, { status: 401 })
    }
    if (IS_TURSO) {
      return NextResponse.json({ success: false, error: 'Backup database tidak tersedia saat menggunakan Turso' }, { status: 400 })
    }
    
    ensureBackupDir()
    
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ success: false, error: 'Database tidak ditemukan' }, { status: 404 })
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const backupName = `backup-${timestamp}.db`
    const backupPath = path.join(BACKUP_DIR, backupName)
    
    fs.copyFileSync(DB_PATH, backupPath)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Backup berhasil dibuat',
      data: { name: backupName }
    })
  } catch (error) {
    console.error('Create backup error:', error)
    return NextResponse.json({ success: false, error: 'Gagal membuat backup' }, { status: 500 })
  }
}

// PUT - Restore backup
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Tidak terautentikasi' }, { status: 401 })
    }
    if (IS_TURSO) {
      return NextResponse.json({ success: false, error: 'Restore database tidak tersedia saat menggunakan Turso' }, { status: 400 })
    }
    
    const { filename } = await request.json()
    
    if (!filename) {
      return NextResponse.json({ success: false, error: 'Nama file harus diisi' }, { status: 400 })
    }
    
    const backupPath = path.join(BACKUP_DIR, filename)
    
    if (!fs.existsSync(backupPath)) {
      return NextResponse.json({ success: false, error: 'File backup tidak ditemukan' }, { status: 404 })
    }
    
    // Disconnect Prisma first
    await db.$disconnect()
    
    // Copy backup to database location
    fs.copyFileSync(backupPath, DB_PATH)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database berhasil dipulihkan. Halaman akan dimuat ulang.' 
    })
  } catch (error) {
    console.error('Restore backup error:', error)
    return NextResponse.json({ success: false, error: 'Gagal memulihkan database' }, { status: 500 })
  }
}

// DELETE - Delete backup or reset database
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Tidak terautentikasi' }, { status: 401 })
    }
    if (IS_TURSO) {
      return NextResponse.json({ success: false, error: 'Aksi ini tidak tersedia saat menggunakan Turso' }, { status: 400 })
    }
    
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    const action = searchParams.get('action')
    
    // Delete specific backup file
    if (filename) {
      const backupPath = path.join(BACKUP_DIR, filename)
      
      if (!fs.existsSync(backupPath)) {
        return NextResponse.json({ success: false, error: 'File backup tidak ditemukan' }, { status: 404 })
      }
      
      fs.unlinkSync(backupPath)
      return NextResponse.json({ success: true, message: 'Backup berhasil dihapus' })
    }
    
    // Reset database (delete all data)
    if (action === 'reset') {
      await db.$disconnect()
      
      // Delete all tables
      if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH)
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database berhasil direset. Silakan jalankan seed untuk mengisi data awal.' 
      })
    }
    
    return NextResponse.json({ success: false, error: 'Aksi tidak valid' }, { status: 400 })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ success: false, error: 'Gagal menghapus' }, { status: 500 })
  }
}
