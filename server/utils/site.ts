// 이 서버가 "테스트(keh69/test)"인지 "거래소(keh69/KTX)"인지. 두 사이트는 같은 Supabase를 같이 쓰므로,
// 사이트마다 따로 관리해야 하는 데이터(예: 이벤트)는 이 값으로 나눈다.
// Vercel이 자동으로 넣어 주는 VERCEL_GIT_REPO_SLUG(저장소 이름)로 판단하고, 직접 KTX_SITE=test|ktx로 정할 수도 있다.
export type SiteKey = 'test' | 'ktx'

export function currentSite(): SiteKey {
  const forced = String(process.env.KTX_SITE || '').trim().toLowerCase()
  if (forced === 'test' || forced === 'ktx') return forced
  const repo = String(process.env.VERCEL_GIT_REPO_SLUG || '').trim().toLowerCase()
  if (repo === 'test') return 'test'
  if (repo) return 'ktx'
  // 로컬 개발 서버는 테스트로 본다.
  return process.env.NODE_ENV === 'production' ? 'ktx' : 'test'
}
