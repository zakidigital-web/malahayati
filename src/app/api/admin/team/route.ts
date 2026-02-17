import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const members = await db.teamMember.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ success: true, data: members }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch team' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, description, education, imageUrl, order, active } = body

    if (!name || !role || !description || !education) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const member = await db.teamMember.create({
      data: { name, role, description, education, imageUrl: imageUrl || null, order: order || 0, active: active !== false },
    })

    return NextResponse.json({ success: true, data: member })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ success: false, error: 'Failed to create team member' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    const member = await db.teamMember.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        description: data.description,
        education: data.education,
        imageUrl: data.imageUrl ?? undefined,
        order: typeof data.order === 'number' ? data.order : undefined,
        active: typeof data.active === 'boolean' ? data.active : undefined,
      },
    })

    return NextResponse.json({ success: true, data: member })
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ success: false, error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    await db.teamMember.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Team member deleted' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete team member' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { members, replaceAll } = body || {}
    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ success: false, error: 'members array is required' }, { status: 400 })
    }
    const data = members.map((m: any, idx: number) => ({
      name: String(m.name).trim(),
      role: String(m.role).trim(),
      description: m.description ? String(m.description) : 'Pengurus Yayasan',
      education: m.education ? String(m.education) : '-',
      imageUrl: m.imageUrl ? String(m.imageUrl) : null,
      order: Number.isFinite(m.order) ? m.order : idx,
      active: m.active !== false,
    }))
    const result = await db.$transaction(async (tx) => {
      if (replaceAll) {
        await tx.teamMember.deleteMany({})
      }
      const create = await tx.teamMember.createMany({ data })
      return create.count
    })
    return NextResponse.json({ success: true, count: result }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Error bulk updating team members:', error)
    return NextResponse.json({ success: false, error: 'Failed to bulk update' }, { status: 500 })
  }
}
