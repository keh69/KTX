import { listSiteEvents } from '../../utils/events'

// 지금 이 사이트(테스트/거래소)에서 진행 중인 이벤트 목록(상단 메뉴용)
export default defineEventHandler(async () => {
  const rows = await listSiteEvents(true).catch(() => [])
  return { items: rows.map((r) => ({ code: r.code, name: r.name, title: r.title })) }
})
