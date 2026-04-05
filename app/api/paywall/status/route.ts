import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getStatus } from '@/lib/paywall'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const status = await getStatus(session.email)
  return NextResponse.json(status)
}
