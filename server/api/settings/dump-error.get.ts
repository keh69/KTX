import { getSupabaseAdminClient } from '../../utils/supabase'

// [임시 · 보여주기용] 차트 화면 덤프오류 설정(ADMIN > 기타 > 어드민 > 덤프오류 탭에서 on/off, n~n초).
// 차트 화면이 30초마다 읽으므로 서버에서 10초 캐시해 DB 읽기를 줄인다.
let cache: { at: number; value: { enabled: boolean; minSec: number; maxSec: number } } | null = null

export default defineEventHandler(async () => {
  if (cache && Date.now() - cache.at < 10_000) return cache.value
  let value = { enabled: false, minSec: 5, maxSec: 10 }
  try {
    const supa = getSupabaseAdminClient()
    const { data } = await supa
      .from('bitduck_system_settings')
      .select('dump_error_enabled, dump_error_min_sec, dump_error_max_sec')
      .eq('id', 1)
      .maybeSingle()
    if (data) {
      const minSec = Math.max(0, Number((data as any).dump_error_min_sec) || 0)
      const maxSec = Math.max(minSec, Number((data as any).dump_error_max_sec) || 0)
      value = { enabled: !!(data as any).dump_error_enabled, minSec, maxSec }
    }
  } catch {
    // 기본값(off)
  }
  cache = { at: Date.now(), value }
  return value
})
