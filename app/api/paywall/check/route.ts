import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkAndIncrement, ActionType } from '@/lib/paywall'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action } = await request.json()
  if (!action) {
    return NextResponse.json({ error: 'Action type required' }, { status: 400 })
  }

  const result = await checkAndIncrement(session.email, action as ActionType)
  return NextResponse.json(result, { status: result.allowed ? 200 : 402 })
}
