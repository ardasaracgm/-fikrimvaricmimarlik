import {NextRequest, NextResponse} from 'next/server'
import {isAdminAuthenticated} from '@/lib/adminAuth'
import {adminClient} from '@/sanity/lib/adminClient'
import {FITOUT_PAGE_ID} from '@/lib/singletons'

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({error: 'Yetkisiz'}, {status: 401})
  }

  const body = await req.json()
  const doc = await adminClient.createOrReplace({_id: FITOUT_PAGE_ID, _type: 'fitoutPage', ...body})
  return NextResponse.json({success: true, doc})
}
