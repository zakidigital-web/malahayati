import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where = status ? { status } : {}

    const consultations = await db.konsultasi.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: consultations,
    })
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consultations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { namaLengkap, nomorWhatsapp, email, jenisPermasalahan, pesan, status, notes } = body
    if (!namaLengkap || !nomorWhatsapp || !email || !jenisPermasalahan || !pesan) {
      return NextResponse.json(
        { success: false, error: 'Field wajib tidak lengkap' },
        { status: 400 }
      )
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format email tidak valid' },
        { status: 400 }
      )
    }
    const konsultasi = await db.konsultasi.create({
      data: {
        namaLengkap,
        nomorWhatsapp,
        email,
        jenisPermasalahan,
        pesan,
        status: status || 'pending',
        notes: notes || null,
      },
    })
    return NextResponse.json({
      success: true,
      data: konsultasi,
    })
  } catch (error) {
    console.error('Error creating consultation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create consultation' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes, namaLengkap, nomorWhatsapp, email, jenisPermasalahan, pesan } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }

    const updateData: {
      status?: string
      notes?: string | null
      namaLengkap?: string
      nomorWhatsapp?: string
      email?: string
      jenisPermasalahan?: string
      pesan?: string
    } = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (namaLengkap !== undefined) updateData.namaLengkap = namaLengkap
    if (nomorWhatsapp !== undefined) updateData.nomorWhatsapp = nomorWhatsapp
    if (email !== undefined) updateData.email = email
    if (jenisPermasalahan !== undefined) updateData.jenisPermasalahan = jenisPermasalahan
    if (pesan !== undefined) updateData.pesan = pesan

    const consultation = await db.konsultasi.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: consultation,
    })
  } catch (error) {
    console.error('Error updating consultation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update consultation' },
      { status: 500 }
    )
  }
}

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

    await db.konsultasi.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Consultation deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting consultation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete consultation' },
      { status: 500 }
    )
  }
}
