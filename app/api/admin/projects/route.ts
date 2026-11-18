import {NextRequest, NextResponse} from 'next/server'
import {isAdminAuthenticated} from '@/lib/adminAuth'
import {adminClient} from '@/sanity/lib/adminClient'

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({error: 'Yetkisiz'}, {status: 401})
  }

  const body = await req.json()
  const doc = await adminClient.create({_type: 'project', ...body})
  return NextResponse.json({success: true, id: doc._id})
}
