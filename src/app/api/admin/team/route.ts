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
    const { name, role, description, education, order, active } = body

    if (!name || !role || !description || !education) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const member = await db.teamMember.create({
      data: { name, role, description, education, order: order || 0, active: active !== false },
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
      data,
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
