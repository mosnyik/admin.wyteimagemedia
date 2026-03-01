import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, screeningStatus, isDisqualified, disqualificationReason, screenedBy } = body

    if (!_id) {
      return NextResponse.json({ error: 'Document _id is required' }, { status: 400 })
    }

    const patch = writeClient.patch(_id)

    if (screeningStatus !== undefined) {
      patch.set({ screeningStatus })
    }

    if (isDisqualified !== undefined) {
      patch.set({ isDisqualified })
    }

    if (disqualificationReason !== undefined) {
      patch.set({ disqualificationReason })
    }

    if (screenedBy !== undefined) {
      patch.set({ screenedBy, screenedAt: new Date().toISOString() })
    }

    const result = await patch.commit()

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error updating contestant:', error)
    return NextResponse.json(
      { error: 'Failed to update contestant' },
      { status: 500 }
    )
  }
}
