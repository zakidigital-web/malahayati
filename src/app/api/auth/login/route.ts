import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Username dan password harus diisi' 
      }, { status: 400 })
    }
    
    const result = await login(username, password)
    
    if (result.success && result.sessionId) {
      const response = NextResponse.json({ success: true })
      
      // Set cookie
      response.cookies.set('admin_session', result.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      })
      
      return response
    }
    
    return NextResponse.json({ 
      success: false, 
      error: result.error 
    }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Terjadi kesalahan pada server' 
    }, { status: 500 })
  }
}
