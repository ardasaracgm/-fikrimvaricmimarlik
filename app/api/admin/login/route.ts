import {NextRequest, NextResponse} from 'next/server'
import {setAdminSession} from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const {password} = (await req.json()) as {password?: string}

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({error: 'Parola hatalı'}, {status: 401})
  }

  await setAdminSession()
  return NextResponse.json({success: true})
}
