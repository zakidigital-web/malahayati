import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, changePassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tidak terautentikasi' 
      }, { status: 401 })
    }
    
    const { currentPassword, newPassword, confirmPassword } = await request.json()
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Semua field harus diisi' 
      }, { status: 400 })
    }
    
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Password baru tidak cocok' 
      }, { status: 400 })
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'Password minimal 6 karakter' 
      }, { status: 400 })
    }
    
    const result = await changePassword(user.userId, currentPassword, newPassword)
    
    if (result.success) {
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: result.error 
    }, { status: 400 })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Terjadi kesalahan pada server' 
    }, { status: 500 })
  }
}
