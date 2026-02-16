import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [articles, consultations, pendingConsultations, teamMembers] = await Promise.all([
      db.article.count({ where: { published: true } }),
      db.konsultasi.count(),
      db.konsultasi.count({ where: { status: 'pending' } }),
      db.teamMember.count({ where: { active: true } }),
    ])

    return NextResponse.json({
      articles,
      consultations,
      pendingConsultations,
      teamMembers,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
