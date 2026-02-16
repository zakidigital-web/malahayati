import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { namaLengkap, nomorWhatsapp, email, jenisPermasalahan, pesan } = body

    // Validate required fields
    if (!namaLengkap || !nomorWhatsapp || !email || !jenisPermasalahan || !pesan) {
      return NextResponse.json(
        { success: false, error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Save to database
    const konsultasi = await db.konsultasi.create({
      data: {
        namaLengkap,
        nomorWhatsapp,
        email,
        jenisPermasalahan,
        pesan,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Permintaan konsultasi berhasil dikirim',
      data: {
        id: konsultasi.id,
        createdAt: konsultasi.createdAt,
      },
    })
  } catch (error) {
    console.error('Error submitting consultation:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const konsultasiList = await db.konsultasi.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: konsultasiList,
    })
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    )
  }
}
