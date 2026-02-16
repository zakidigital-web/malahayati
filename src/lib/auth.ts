import { cookies } from 'next/headers'
import { db } from './db'
import crypto from 'crypto'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  const [salt, hash] = storedPassword.split(':')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  
  // Store session in database
  await db.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    }
  })
  
  return sessionId
}

export async function validateSession(sessionId: string): Promise<{ userId: string; username: string } | null> {
  try {
    const session = await db.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    })
    
    if (!session) return null
    
    if (session.expiresAt < new Date()) {
      // Session expired, delete it
      await db.session.delete({ where: { id: sessionId } })
      return null
    }
    
    return { userId: session.userId, username: session.user.username }
  } catch {
    return null
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await db.session.delete({ where: { id: sessionId } })
  } catch {
    // Ignore errors
  }
}

export async function getCurrentUser(): Promise<{ userId: string; username: string } | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!sessionId) return null
  
  return validateSession(sessionId)
}

export async function login(username: string, password: string): Promise<{ success: boolean; error?: string; sessionId?: string }> {
  // Find user by username
  const user = await db.user.findFirst({ where: { username, role: 'admin' } })
  
  if (!user || !user.password) {
    return { success: false, error: 'Username atau password salah' }
  }
  
  // Verify password
  const isValid = await verifyPassword(password, user.password)
  
  if (!isValid) {
    return { success: false, error: 'Username atau password salah' }
  }
  
  // Create session
  const sessionId = await createSession(user.id)
  
  return { success: true, sessionId }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (sessionId) {
    await deleteSession(sessionId)
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const user = await db.user.findFirst({ where: { id: userId } })
  
  if (!user || !user.password) {
    return { success: false, error: 'User tidak ditemukan' }
  }
  
  // Verify current password
  const isValid = await verifyPassword(currentPassword, user.password)
  
  if (!isValid) {
    return { success: false, error: 'Password lama tidak sesuai' }
  }
  
  // Hash new password
  const hashedPassword = await hashPassword(newPassword)
  
  // Update password
  await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  })
  
  return { success: true }
}
