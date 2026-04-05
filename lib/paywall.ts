import { createClient } from '@supabase/supabase-js'

export type ActionType = 'screening' | 'qualification' | 'view_profile' | 'email'

export const LIMITS: Record<ActionType, number> = {
  screening: 2,
  qualification: 2,
  view_profile: 2,
  email: 3,
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars not configured')
  return createClient(url, key)
}

export async function getStatus(
  userEmail: string
): Promise<Record<ActionType, { count: number; limit: number; remaining: number }>> {
  const supabase = getClient()
  const types: ActionType[] = ['screening', 'qualification', 'view_profile', 'email']

  const { data } = await supabase
    .from('paywall_actions')
    .select('action_type, count')
    .eq('user_email', userEmail)

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.action_type] = row.count
  }

  const result = {} as Record<ActionType, { count: number; limit: number; remaining: number }>
  for (const type of types) {
    const count = counts[type] ?? 0
    const limit = LIMITS[type]
    result[type] = { count, limit, remaining: Math.max(0, limit - count) }
  }

  return result
}

export async function checkAndIncrement(
  userEmail: string,
  actionType: ActionType
): Promise<{ allowed: boolean; count: number; limit: number }> {
  // If PAID=true, bypass the paywall entirely
  if (process.env.PAID === 'true') {
    return { allowed: true, count: 0, limit: LIMITS[actionType] }
  }

  const supabase = getClient()
  const limit = LIMITS[actionType]

  const { data, error } = await supabase.rpc('check_and_increment_paywall', {
    p_user_email: userEmail,
    p_action_type: actionType,
    p_limit: limit,
  })

  if (error) {
    console.error('Paywall check error:', error)
    return { allowed: true, count: 0, limit } // fail open
  }

  const row = data?.[0]
  return {
    allowed: row?.allowed ?? true,
    count: row?.count ?? 0,
    limit: row?.limit_val ?? limit,
  }
}
