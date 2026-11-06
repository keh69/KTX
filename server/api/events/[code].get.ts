import { getSessionUser } from '../../utils/auth'
import { getSiteEvent, kstWeekRange, maskUsername, weeklyVolumeRank } from '../../utils/events'

// 이벤트 상세 + 이번 주(또는 지난주) 순위. 회원 화면이라 다른 회원 아이디는 가려서 보낸다.
export default defineEventHandler(async (event) => {
  const code = String(getRouterParam(event, 'code') || '')
  const ev = await getSiteEvent(code)
  if (!ev || !ev.enabled) throw createError({ statusCode: 404, statusMessage: '진행 중인 이벤트가 아닙니다.' })
  const week = String(getQuery(event).week || '') === 'last' ? -1 : 0
  const { from, to } = kstWeekRange(week)
  const me = await getSessionUser(event).catch(() => null)

  let ranking: any[] = []
  let mine: any = null
  if (ev.kind === 'weekly_volume') {
    const rows = await weeklyVolumeRank(from, to, 20)
    ranking = rows.map((r) => ({
      rank: r.rank,
      name: me && Number(me.id) === r.user_id ? r.username : maskUsername(r.username),
      isMe: !!me && Number(me.id) === r.user_id,
      volume: r.volume,
      trades: r.trades
    }))
    if (me) {
      const m = (await weeklyVolumeRank(from, to, 1, Number(me.id)))[0]
      mine = m ? { rank: m.rank, volume: m.volume, trades: m.trades } : { rank: null, volume: 0, trades: 0 }
    }
  }
  return {
    event: { code: ev.code, name: ev.name, kind: ev.kind, title: ev.title, description: ev.description, prizes: ev.prizes || [] },
    period: { from: from.toISOString(), to: to.toISOString(), week: week === -1 ? 'last' : 'this' },
    ranking,
    mine,
    loggedIn: !!me
  }
})
