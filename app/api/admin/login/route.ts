import {NextRequest, NextResponse} from 'next/server'
import {setAdminSession} from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const {username, password} = (await req.json()) as {username?: string; password?: string}
  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD

  if (
    !expectedUser ||
    !expectedPass ||
    username?.trim() !== expectedUser ||
    password !== expectedPass
  ) {
    return NextResponse.json({error: 'Kullanıcı adı veya parola hatalı'}, {status: 401})
  }

  await setAdminSession()
  return NextResponse.json({success: true})
}
