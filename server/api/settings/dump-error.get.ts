import { getSupabaseAdminClient } from '../../utils/supabase'
import { currentSite } from '../../utils/site'
import { CHART_TIMING_DEFAULTS, normalizeChartTiming } from '../../utils/chart-timing'

// [임시 · 보여주기용] 차트 화면 덤프오류 설정(ADMIN > 기타 > 어드민 > 덤프오류 탭에서 on/off, n~n초).
// 거래소(keh69/KTX)는 dump_error_*, 테스트(keh69/test)는 dump_error_test_* 컬럼을 읽는다.
// 차트 화면이 30초마다 읽으므로 서버에서 10초 캐시해 DB 읽기를 줄인다.
// timing = 차트 화면 갱신 주기(ADMIN > 설정 > 차트 갱신주기, 테스트/거래소 공통)
let cache: { at: number; value: { enabled: boolean; minSec: number; maxSec: number; ls: { enabled: boolean; pct: number }; timing: typeof CHART_TIMING_DEFAULTS } } | null = null

export default defineEventHandler(async () => {
  if (cache && Date.now() - cache.at < 10_000) return cache.value
  const p = currentSite() === 'test' ? 'dump_error_test_' : 'dump_error_'
  // 롱숏 덤프(롱/숏 버튼을 누를 때 pct% 확률로 덤프 페이지): 거래소 dump_ls_*, 테스트 dump_ls_test_*
  const lp = currentSite() === 'test' ? 'dump_ls_test_' : 'dump_ls_'
  let value = { enabled: false, minSec: 5, maxSec: 10, ls: { enabled: false, pct: 0 }, timing: { ...CHART_TIMING_DEFAULTS } }
  try {
    const supa = getSupabaseAdminClient()
    const { data } = await supa
      .from('bitduck_system_settings')
      .select(`${p}enabled, ${p}min_sec, ${p}max_sec, ${lp}enabled, ${lp}pct, chart_timing`)
      .eq('id', 1)
      .maybeSingle()
    if (data) {
      const d = data as any
      const minSec = Math.max(0, Number(d[`${p}min_sec`]) || 0)
      const maxSec = Math.max(minSec, Number(d[`${p}max_sec`]) || 0)
      const pct = Math.min(100, Math.max(0, Number(d[`${lp}pct`]) || 0))
      value = { enabled: !!d[`${p}enabled`], minSec, maxSec, ls: { enabled: !!d[`${lp}enabled`], pct }, timing: normalizeChartTiming(d.chart_timing) }
    }
  } catch {
    // 기본값(off)
  }
  cache = { at: Date.now(), value }
  return value
})
