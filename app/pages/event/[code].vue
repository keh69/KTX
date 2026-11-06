<template>
  <div class="space-y-6">
    <div v-if="pending && !data" class="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">{{ t('불러오는 중…', 'Loading…') }}</div>
    <div v-else-if="error" class="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
      {{ error?.data?.statusMessage || t('진행 중인 이벤트가 아닙니다.', 'This event is not running.') }}
    </div>
    <template v-else-if="data">
      <!-- 이벤트 소개 -->
      <section class="overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-white/[0.03] to-transparent p-6">
        <div class="text-xs font-semibold tracking-wide text-amber-300">{{ data.event.name }}</div>
        <h1 class="mt-1 text-2xl font-bold text-white">{{ data.event.title }}</h1>
        <p class="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">{{ data.event.description }}</p>
        <div class="mt-4 inline-flex items-center gap-2 rounded-lg bg-black/30 px-3 py-1.5 text-xs text-slate-300">
          <span class="text-slate-500">{{ t('기간', 'Period') }}</span>
          <span>{{ fmtDay(data.period.from) }} ~ {{ fmtDay(lastDay(data.period.to)) }} ({{ t('한국시간', 'KST') }})</span>
        </div>
        <div v-if="data.event.prizes?.length" class="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(p, i) in data.event.prizes" :key="i" class="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <div class="text-xs text-slate-400">{{ p.rank }}</div>
            <div class="mt-1 text-lg font-semibold text-amber-300">{{ p.reward }}</div>
          </div>
        </div>
      </section>

      <!-- 내 순위 -->
      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-base font-semibold">{{ t('내 기록', 'My record') }}</h2>
          <div class="flex gap-1 rounded-lg bg-black/30 p-1 text-xs">
            <button type="button" class="rounded-md px-3 py-1.5" :class="week === 'this' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'" @click="week = 'this'">{{ t('이번 주', 'This week') }}</button>
            <button type="button" class="rounded-md px-3 py-1.5" :class="week === 'last' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'" @click="week = 'last'">{{ t('지난 주', 'Last week') }}</button>
          </div>
        </div>
        <div v-if="!data.loggedIn" class="mt-3 text-sm text-slate-400">
          {{ t('로그인하면 내 순위와 거래량을 볼 수 있습니다.', 'Log in to see your rank and volume.') }}
          <NuxtLink to="/auth/login" class="ml-1 font-semibold text-amber-300 underline underline-offset-4">{{ t('로그인', 'Log in') }}</NuxtLink>
        </div>
        <div v-else class="mt-3 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-black/20 px-4 py-3">
            <div class="text-xs text-slate-400">{{ t('내 순위', 'My rank') }}</div>
            <div class="mt-1 text-xl font-semibold text-white">{{ data.mine?.rank ? t(`${data.mine.rank}위`, `#${data.mine.rank}`) : t('기록 없음', 'No record') }}</div>
          </div>
          <div class="rounded-xl bg-black/20 px-4 py-3">
            <div class="text-xs text-slate-400">{{ t('내 거래량', 'My volume') }}</div>
            <div class="mt-1 text-xl font-semibold text-white">{{ fmtUsd(data.mine?.volume || 0) }} <span class="text-sm text-slate-400">USDT</span></div>
          </div>
          <div class="rounded-xl bg-black/20 px-4 py-3">
            <div class="text-xs text-slate-400">{{ t('거래 횟수', 'Trades') }}</div>
            <div class="mt-1 text-xl font-semibold text-white">{{ data.mine?.trades || 0 }}</div>
          </div>
        </div>
      </section>

      <!-- 순위표 -->
      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 class="text-base font-semibold">{{ week === 'last' ? t('지난 주 순위', 'Last week ranking') : t('이번 주 실시간 순위', 'Live ranking this week') }}</h2>
        <p class="mt-1 text-xs text-slate-500">{{ t('거래량 = 체결금액(진입 + 청산) 합계 · 1분마다 갱신', 'Volume = filled amount (open + close) · refreshes every minute') }}</p>
        <div v-if="!data.ranking.length" class="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-500">
          {{ t('아직 기록이 없습니다. 첫 번째 주인공이 되어 보세요!', 'No records yet. Be the first!') }}
        </div>
        <div v-else class="mt-4 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="text-xs text-slate-400">
              <tr class="border-b border-white/10">
                <th class="px-3 py-2 text-left">{{ t('순위', 'Rank') }}</th>
                <th class="px-3 py-2 text-left">{{ t('아이디', 'ID') }}</th>
                <th class="px-3 py-2 text-right">{{ t('거래량 (USDT)', 'Volume (USDT)') }}</th>
                <th class="px-3 py-2 text-right">{{ t('거래 횟수', 'Trades') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in data.ranking" :key="r.rank" class="border-b border-white/5" :class="r.isMe ? 'bg-amber-400/10' : ''">
                <td class="px-3 py-2.5">
                  <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold" :class="rankClass(r.rank)">{{ r.rank }}</span>
                </td>
                <td class="px-3 py-2.5 font-mono text-slate-200">{{ r.name }}<span v-if="r.isMe" class="ml-1 text-xs text-amber-300">({{ t('나', 'me') }})</span></td>
                <td class="px-3 py-2.5 text-right font-mono text-slate-100">{{ fmtUsd(r.volume) }}</td>
                <td class="px-3 py-2.5 text-right text-slate-400">{{ r.trades }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale()
const route = useRoute()
const code = computed(() => String(route.params.code || ''))
const week = ref<'this' | 'last'>('this')

type EventDetail = {
  event: { code: string; name: string; kind: string; title: string; description: string; prizes: Array<{ rank: string; reward: string }> }
  period: { from: string; to: string; week: string }
  ranking: Array<{ rank: number; name: string; isMe: boolean; volume: number; trades: number }>
  mine: { rank: number | null; volume: number; trades: number } | null
  loggedIn: boolean
}

const { data, pending, error, refresh } = await useFetch<EventDetail>(() => `/api/events/${encodeURIComponent(code.value)}`, {
  query: computed(() => ({ week: week.value })),
  watch: [week]
})

let timer: any = null
onMounted(() => {
  timer = setInterval(() => refresh(), 60000)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

function fmtUsd(v: number) {
  return Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtDay(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', weekday: 'short' })
}
// 기간 끝은 "다음 월요일 00:00"이라 화면에는 그 전날(일요일)로 보여 준다.
function lastDay(iso: string) {
  return new Date(new Date(iso).getTime() - 1000).toISOString()
}
function rankClass(rank: number) {
  if (rank === 1) return 'bg-amber-400 text-slate-900'
  if (rank === 2) return 'bg-slate-300 text-slate-900'
  if (rank === 3) return 'bg-orange-400 text-slate-900'
  return 'bg-white/10 text-slate-200'
}

useHead({ title: computed(() => (data.value?.event?.title ? `${data.value.event.title} | KTX` : 'KTX')) })
</script>
