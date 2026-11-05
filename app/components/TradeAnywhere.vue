<template>
  <div class="mx-auto grid max-w-[1500px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
    <div>
      <h2 class="text-[34px] font-black leading-tight text-white md:text-[46px]">{{ t('언제 어디서나 거래하세요', 'Trade Anytime, Anywhere') }}</h2>
      <p class="mt-5 text-[18px] text-slate-400">
        {{ t('거래하고, 확인하고, 소식을 놓치지 마세요 — 모든 플랫폼 간 완벽한 동기화', 'Trade, Track, Stay Informed — Full cross-platform synchronization') }}
      </p>

      <div class="mt-12 flex flex-wrap items-start gap-8">
        <!-- QR 코드(사이트 주소) -->
        <a href="#" @click.prevent="onAppButton" class="flex h-[176px] w-[176px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#ffffff] p-1" aria-label="QR code">
          <!-- https://ktxexchange.com/ 로 연결되는 QR. 스캐너가 잘 읽도록 주변 흰 여백(quiet zone)을 4칸 둔다 -->
          <svg :viewBox="`-4 -4 ${QR_N + 8} ${QR_N + 8}`" class="h-full w-full" shape-rendering="crispEdges">
            <rect x="-4" y="-4" :width="QR_N + 8" :height="QR_N + 8" fill="#ffffff" />
            <path :d="QR_PATH" fill="#111111" />
          </svg>
        </a>

        <div class="grid grid-cols-2 gap-x-8 gap-y-3">
          <div class="col-span-1 text-[22px] font-medium text-white">iOS</div>
          <div class="col-span-1 text-[22px] font-medium text-white">Android</div>

          <a href="#" @click.prevent="onAppButton" class="flex w-[190px] items-center gap-3 rounded-xl bg-white/[0.05] px-4 py-3 hover:bg-white/[0.09]">
            <svg viewBox="0 0 24 24" class="h-8 w-8 shrink-0 text-white" fill="currentColor" aria-hidden="true">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            <span class="leading-tight"><span class="block text-[13px] text-slate-300">{{ t('다운로드', 'Get it on the') }}</span><span class="block text-[20px] font-medium text-white">App Store</span></span>
          </a>
          <a href="#" @click.prevent="onAppButton" class="flex w-[190px] items-center gap-3 rounded-xl bg-white/[0.05] px-4 py-3 hover:bg-white/[0.09]">
            <svg viewBox="0 0 24 24" class="h-8 w-8 shrink-0" aria-hidden="true">
              <path fill="#00d2ff" d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.7 2.2z" />
              <path fill="#ffce00" d="m16.1 15.4-3.1-3.1v-.2l3.1-3.1.1.1 3.7 2.1c1 .6 1 1.6 0 2.2l-3.7 2z" />
              <path fill="#f43d54" d="m16.2 15.3-3.2-3.2-9.4 9.4c.4.4.9.4 1.6.1l11-6.3" />
              <path fill="#00e07d" d="M16.2 8.9 5.2 2.6c-.7-.4-1.2-.3-1.6.1l9.4 9.4 3.2-3.2z" />
            </svg>
            <span class="leading-tight"><span class="block text-[13px] text-slate-300">{{ t('다운로드', 'Get it on the') }}</span><span class="block text-[20px] font-medium text-white">GooglePlay</span></span>
          </a>

          <a href="#" @click.prevent="onAppButton" class="flex w-[190px] items-center gap-3 rounded-xl bg-white/[0.05] px-4 py-3 hover:bg-white/[0.09]">
            <svg viewBox="0 0 24 24" class="h-8 w-8 shrink-0 text-white" fill="currentColor" aria-hidden="true">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            <span class="leading-tight"><span class="block text-[13px] text-slate-300">{{ t('다운로드', 'Get it on the') }}</span><span class="block text-[20px] font-medium text-white">Test Flight</span></span>
          </a>
          <a href="#" @click.prevent="onAppButton" class="flex w-[190px] items-center gap-3 rounded-xl bg-white/[0.05] px-4 py-3 hover:bg-white/[0.09]">
            <svg viewBox="0 0 24 24" class="h-8 w-8 shrink-0 text-white" fill="currentColor" aria-hidden="true">
              <path d="M6 18c0 .55.45 1 1 1h1v3.5a1.5 1.5 0 0 0 3 0V19h2v3.5a1.5 1.5 0 0 0 3 0V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8A1.5 1.5 0 0 0 2 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 3.5 8zm17 0A1.5 1.5 0 0 0 19 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 20.5 8zM15.53 2.16l1.3-1.3a.5.5 0 0 0-.7-.71l-1.48 1.48A5.97 5.97 0 0 0 12 1.2c-.96 0-1.86.23-2.65.63L7.88.35a.5.5 0 0 0-.7.71l1.3 1.3A5.99 5.99 0 0 0 6 7h12c0-1.8-.8-3.4-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
            </svg>
            <span class="leading-tight"><span class="block text-[13px] text-slate-300">{{ t('APK 다운로드', 'Download the APK') }}</span><span class="block text-[20px] font-medium text-white">Android</span></span>
          </a>
        </div>
      </div>
    </div>

    <!-- 앱 화면(두 대의 휴대폰). 아래로 갈수록 서서히 사라진다 -->
    <div class="relative mx-auto h-[420px] w-full max-w-[520px] overflow-hidden" aria-hidden="true" style="-webkit-mask-image: linear-gradient(180deg, #000 70%, transparent 100%); mask-image: linear-gradient(180deg, #000 70%, transparent 100%)">
      <!-- 뒤 휴대폰: 선물 거래 화면 -->
      <div class="absolute left-0 top-[44px] w-[250px] rounded-[30px] border border-slate-300/60 bg-[#ffffff] px-4 pb-6 pt-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
        <div class="flex items-center justify-between text-[10px] font-semibold text-slate-900"><span>10:35</span><span>▮▮▮</span></div>
        <div class="mt-3 flex gap-3 text-[9px] font-semibold text-slate-500"><span class="text-slate-900">USDT-M</span><span>MINI-M</span><span>Copy Trade</span></div>
        <div class="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-slate-900"><span class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#f7931a] text-[8px] text-white">₿</span>BTCUSDT Perpetual <span class="text-[8px] text-rose-500">-1.00%</span></div>
        <div class="mt-2 grid grid-cols-[1fr_1fr] gap-2">
          <div class="space-y-[3px] text-[8px]">
            <div v-for="r in asks" :key="r.p" class="flex justify-between"><span class="text-rose-500">{{ r.p }}</span><span class="text-slate-600">{{ r.q }}</span></div>
            <div class="py-1 text-[11px] font-bold text-emerald-500">65077.7 ▾</div>
            <div v-for="r in bids" :key="r.p" class="flex justify-between"><span class="text-emerald-500">{{ r.p }}</span><span class="text-slate-600">{{ r.q }}</span></div>
          </div>
          <div class="space-y-2 text-[8px] text-slate-500">
            <div class="flex gap-1"><span class="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">Isolated</span><span class="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">10X</span></div>
            <div class="rounded bg-[#f0b90b]/90 px-2 py-1.5 text-center font-bold text-slate-900">Open Position</div>
            <div class="rounded border border-slate-200 px-2 py-1.5">Limit</div>
            <div class="rounded border border-slate-200 px-2 py-1.5">65081.9</div>
            <div class="rounded border border-slate-200 px-2 py-1.5">Amount</div>
            <div class="h-1 rounded bg-slate-200" />
            <div class="rounded bg-emerald-500/90 px-2 py-2 text-center font-bold text-white">Long</div>
          </div>
        </div>
      </div>

      <!-- 앞 휴대폰: 자산 화면 -->
      <div class="absolute right-0 top-0 w-[260px] rounded-[30px] border border-slate-300/60 bg-[#ffffff] px-4 pb-6 pt-3 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
        <div class="flex items-center justify-between text-[10px] font-semibold text-slate-900"><span>10:35</span><span>▮▮▮</span></div>
        <div class="mt-2 flex items-center gap-2">
          <span class="flex h-5 w-5 items-center justify-center rounded bg-[#f0b90b] text-[10px] font-black text-slate-900">K</span>
          <div class="h-5 flex-1 rounded-full bg-slate-100 px-2 text-[8px] leading-5 text-slate-400">Search tokens</div>
        </div>
        <div class="mt-2 truncate text-[7px] text-slate-500">KTX Lists 10 New US Stock Perpetual Contracts</div>
        <div class="mt-3 text-[8px] text-slate-500">Total Asset Valuation</div>
        <div class="flex items-center justify-between">
          <div class="text-[18px] font-bold text-slate-900">90.80 <span class="text-[9px]">USDT</span></div>
          <span class="rounded bg-[#f0b90b] px-3 py-1 text-[9px] font-bold text-slate-900">Deposit</span>
        </div>
        <div class="mt-3 grid grid-cols-5 gap-1 text-center text-[7px] text-slate-600">
          <div v-for="i in ['Earn', 'Buy', 'Rewards', 'CopyTrade', 'Launchpool']" :key="i"><div class="mx-auto mb-1 h-6 w-6 rounded-lg bg-[#f0b90b]/25" />{{ i }}</div>
        </div>
        <div class="mt-3 rounded-lg bg-slate-100 px-3 py-3 text-[9px] font-bold text-slate-900">KTX Copy Trading Live <span class="ml-1 rounded bg-[#f0b90b] px-1 py-0.5 text-[7px]">Join Copy Trading Now</span></div>
        <div class="mt-3 flex justify-between text-[9px] font-bold text-slate-900"><span>Finance</span><span>›</span></div>
        <div class="mt-2 grid grid-cols-2 gap-2 text-[8px]">
          <div class="rounded-lg border border-slate-200 p-2"><div class="font-bold text-slate-900">USDT</div><div class="mt-1 text-slate-600">2.00%~5.00%</div></div>
          <div class="rounded-lg border border-slate-200 p-2"><div class="font-bold text-slate-900">USDT</div><div class="mt-1 text-slate-600">9.00%</div></div>
        </div>
        <div class="mt-3 flex justify-between text-[9px] font-bold text-slate-900"><span>Market</span><span>›</span></div>
        <div class="mt-2 rounded-lg border border-slate-200 p-2 text-[8px] text-slate-600">BTC Market Cap Dominance <span class="ml-1 font-bold text-slate-900">59.04%</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale()
const { me } = useMe()
// 스토어/QR 버튼: 로그인 전에는 로그인 화면으로, 로그인했다면 삼성전자(SAMSUNGUSDT) 차트로 이동한다(첫 화면의 앱 다운로드 버튼과 같은 규칙).
const target = computed(() => (me.value ? '/exchange/SAMSUNGUSDT' : '/auth/login'))
// 로그인한 뒤에는 "27년 2월 출시 예정" 안내를 띄운다(로그인 전에는 로그인 화면으로).
const launchNotice = useLaunchNotice()
function onAppButton() {
  if (!me.value) {
    navigateTo('/auth/login')
    return
  }
  launchNotice.show()
}

const QR_N = 25
const QR_PATH = 'M0 0h7v1h-7zM10 0h1v1h-1zM16 0h1v1h-1zM18 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM9 1h3v1h-3zM13 1h3v1h-3zM18 1h1v1h-1zM24 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h2v1h-2zM14 2h1v1h-1zM16 2h1v1h-1zM18 2h1v1h-1zM20 2h3v1h-3zM24 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h1v1h-1zM11 3h1v1h-1zM13 3h2v1h-2zM18 3h1v1h-1zM20 3h3v1h-3zM24 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM16 4h1v1h-1zM18 4h1v1h-1zM20 4h3v1h-3zM24 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM11 5h1v1h-1zM14 5h3v1h-3zM18 5h1v1h-1zM24 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h7v1h-7zM8 7h1v1h-1zM14 7h2v1h-2zM0 8h1v1h-1zM2 8h5v1h-5zM9 8h1v1h-1zM11 8h1v1h-1zM13 8h1v1h-1zM15 8h1v1h-1zM18 8h5v1h-5zM2 9h3v1h-3zM13 9h1v1h-1zM16 9h2v1h-2zM19 9h1v1h-1zM23 9h1v1h-1zM1 10h1v1h-1zM4 10h6v1h-6zM12 10h4v1h-4zM17 10h5v1h-5zM23 10h2v1h-2zM0 11h2v1h-2zM5 11h1v1h-1zM8 11h1v1h-1zM12 11h1v1h-1zM15 11h1v1h-1zM18 11h1v1h-1zM20 11h1v1h-1zM24 11h1v1h-1zM0 12h1v1h-1zM3 12h1v1h-1zM6 12h1v1h-1zM8 12h4v1h-4zM13 12h2v1h-2zM17 12h2v1h-2zM20 12h1v1h-1zM22 12h3v1h-3zM0 13h3v1h-3zM4 13h1v1h-1zM7 13h1v1h-1zM10 13h1v1h-1zM12 13h1v1h-1zM16 13h2v1h-2zM19 13h1v1h-1zM21 13h1v1h-1zM23 13h1v1h-1zM0 14h1v1h-1zM2 14h5v1h-5zM8 14h3v1h-3zM13 14h1v1h-1zM15 14h2v1h-2zM19 14h3v1h-3zM23 14h2v1h-2zM0 15h1v1h-1zM2 15h2v1h-2zM5 15h1v1h-1zM8 15h1v1h-1zM12 15h1v1h-1zM14 15h1v1h-1zM18 15h3v1h-3zM24 15h1v1h-1zM0 16h1v1h-1zM3 16h1v1h-1zM6 16h2v1h-2zM9 16h1v1h-1zM12 16h9v1h-9zM22 16h1v1h-1zM8 17h2v1h-2zM13 17h1v1h-1zM15 17h2v1h-2zM20 17h2v1h-2zM0 18h7v1h-7zM11 18h4v1h-4zM16 18h1v1h-1zM18 18h1v1h-1zM20 18h1v1h-1zM22 18h3v1h-3zM0 19h1v1h-1zM6 19h1v1h-1zM8 19h2v1h-2zM11 19h1v1h-1zM14 19h1v1h-1zM16 19h1v1h-1zM20 19h2v1h-2zM24 19h1v1h-1zM0 20h1v1h-1zM2 20h3v1h-3zM6 20h1v1h-1zM8 20h1v1h-1zM10 20h11v1h-11zM22 20h1v1h-1zM0 21h1v1h-1zM2 21h3v1h-3zM6 21h1v1h-1zM8 21h3v1h-3zM12 21h2v1h-2zM15 21h1v1h-1zM17 21h2v1h-2zM20 21h5v1h-5zM0 22h1v1h-1zM2 22h3v1h-3zM6 22h1v1h-1zM8 22h1v1h-1zM10 22h1v1h-1zM14 22h3v1h-3zM21 22h2v1h-2zM24 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM9 23h1v1h-1zM11 23h1v1h-1zM14 23h1v1h-1zM16 23h6v1h-6zM24 23h1v1h-1zM0 24h7v1h-7zM8 24h1v1h-1zM11 24h3v1h-3zM17 24h8v1h-8z'

const asks = [
  { p: '65081.4', q: '618.6' },
  { p: '65081.1', q: '643.65' },
  { p: '65080.9', q: '1644.46' },
  { p: '65080.2', q: '118.641' }
]
const bids = [
  { p: '65077.8', q: '115.82K' },
  { p: '65077.3', q: '800K' },
  { p: '65076.7', q: '683.83' },
  { p: '65076.5', q: '649.27' }
]
</script>
