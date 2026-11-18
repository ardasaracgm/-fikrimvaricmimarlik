import {cookies} from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'hauzart_admin_session'

function sessionToken(): string {
  return crypto
    .createHash('sha256')
    .update(`${process.env.ADMIN_PASSWORD}::hauzart-admin-salt`)
    .digest('hex')
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  // ADMIN_PASSWORD tanımlı değilse (ör. gerçek domain'in Vercel projesi) admin tamamen kapalı;
  // aksi halde oturum anahtarı "undefined::..." hash'i olur ve tahmin edilebilir.
  if (!process.env.ADMIN_PASSWORD) return false
  const token = cookieStore.get(COOKIE_NAME)?.value
  return Boolean(token) && token === sessionToken()
}

export async function setAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
