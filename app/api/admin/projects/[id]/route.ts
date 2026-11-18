import {NextRequest, NextResponse} from 'next/server'
import {isAdminAuthenticated} from '@/lib/adminAuth'
import {adminClient} from '@/sanity/lib/adminClient'

export async function PATCH(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({error: 'Yetkisiz'}, {status: 401})
  }

  const {id} = await params
  const body = await req.json()

  const result = await adminClient.patch(id).set(body).commit()
  return NextResponse.json({success: true, result})
}

export async function DELETE(_req: NextRequest, {params}: {params: Promise<{id: string}>}) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({error: 'Yetkisiz'}, {status: 401})
  }

  const {id} = await params
  await adminClient.delete(id)
  return NextResponse.json({success: true})
}
