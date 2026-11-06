import { getSupabaseAdminClient } from './supabase'
import { supabaseAppDbEnabled } from './supa-appdb'
import { currentSite } from './site'

export type EventRow = {
  id: number
  site: string
  code: string
  name: string
  kind: string
  title: string
  description: string
  prizes: Array<{ rank: string; reward: string }>
  enabled: boolean
}

// 이번 주(한국시간 월요일 00:00 ~ 다음 월요일 00:00) 구간. offsetWeeks=-1이면 지난주.
export function kstWeekRange(offsetWeeks = 0, nowMs = Date.now()) {
  const KST = 9 * 3600 * 1000
  const k = new Date(nowMs + KST)
  const dow = (k.getUTCDay() + 6) % 7 // 월=0
  const startKst = Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate() - dow + offsetWeeks * 7)
  const from = new Date(startKst - KST)
  const to = new Date(startKst - KST + 7 * 24 * 3600 * 1000)
  return { from, to }
}

export async function listSiteEvents(onlyEnabled = true): Promise<EventRow[]> {
  if (!supabaseAppDbEnabled()) return []
  let q: any = getSupabaseAdminClient().from('bitduck_events').select('*').eq('site', currentSite()).order('id', { ascending: true })
  if (onlyEnabled) q = q.eq('enabled', true)
  const { data } = await q
  return (data || []) as EventRow[]
}

export async function getSiteEvent(code: string): Promise<EventRow | null> {
  if (!supabaseAppDbEnabled()) return null
  const { data } = await getSupabaseAdminClient()
    .from('bitduck_events')
    .select('*')
    .eq('site', currentSite())
    .eq('code', code)
    .limit(1)
  return ((data || [])[0] as EventRow) || null
}

export type VolumeRankRow = { rank: number; user_id: number; username: string; volume: number; trades: number }

// 거래량 순위(체결금액 = 진입 + 청산, USDT). userId를 주면 그 회원의 순위만.
export async function weeklyVolumeRank(from: Date, to: Date, limit = 20, userId?: number): Promise<VolumeRankRow[]> {
  if (!supabaseAppDbEnabled()) return []
  const { data, error } = await getSupabaseAdminClient().rpc('bitduck_event_volume_rank', {
    p_from: from.toISOString(),
    p_to: to.toISOString(),
    p_limit: limit,
    p_user: userId ?? null
  })
  if (error) throw error
  return ((data || []) as any[]).map((r) => ({
    rank: Number(r.rank),
    user_id: Number(r.user_id),
    username: String(r.username || ''),
    volume: Number(r.volume) || 0,
    trades: Number(r.trades) || 0
  }))
}

// 회원 화면용 아이디 가리기: 앞 2글자만 보이고 나머지는 *
export function maskUsername(u: string) {
  const s = String(u || '')
  if (s.length <= 2) return s.slice(0, 1) + '*'
  return s.slice(0, 2) + '*'.repeat(Math.min(6, s.length - 2))
}
