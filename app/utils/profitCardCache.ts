// 수익카드 디자인(설정 + PNG 그림)을 회원 브라우저(localStorage)에 보관한다.
// 한 번 받은 카드는 다음 방문에도 그대로 쓰고, 서버에는 "내가 가진 버전(v)"만 알려준다.
// 서버는 버전이 같으면 카드 데이터를 보내지 않고, 어드민에서 카드가 바뀐 경우에만 새 카드를 보낸다(받으면 다시 보관).
// 쿠키는 4KB까지만 담을 수 있어 카드(그림 포함)를 넣을 수 없으므로 localStorage를 쓴다.
const KEY = 'ktx_profit_card_v1'

export function loadCachedProfitCard(): { version: string; style: any } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data.version !== 'string' || !data.style || typeof data.style !== 'object') return null
    return { version: data.version, style: data.style }
  } catch {
    return null
  }
}

export function saveCachedProfitCard(version: string, style: any) {
  if (typeof window === 'undefined' || !version || !style) return
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ version, style }))
  } catch {
    // 저장 공간이 부족하거나 막혀 있으면 그냥 넘어간다(다음 방문 때 다시 받음)
  }
}
