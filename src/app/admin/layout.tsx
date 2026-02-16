import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import AdminSidebar from '@/components/admin/Sidebar'

async function validateSession(sessionId: string) {
  try {
    const session = await db.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    })
    
    if (!session) return null
    
    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { id: sessionId } })
      return null
    }
    
    return { userId: session.userId, username: session.user.username }
  } catch {
    return null
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('admin_session')?.value
  
  if (!sessionId) {
    redirect('/auth/login')
  }
  
  const user = await validateSession(sessionId)
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar username={user.username} />
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
