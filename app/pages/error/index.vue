<template>
  <!-- [임시 · 보여주기용] 덤프오류 전용 페이지. 차트 화면에서 덤프오류가 ON이면 이 페이지로 넘어온다.
       헤더·메뉴·버튼 없이 오류 화면만 보인다. ADMIN에서 OFF로 바꾸면 30초 안에 원래 차트로 돌아간다. -->
  <div class="dump">
    <div class="dump-wrap">
      <div class="dump-head">
        <span class="dump-icon">⚠</span>
        <div class="dump-head-text">
          <div class="dump-title">{{ entry ? entry.message.split(' [')[0] : 'Error' }}</div>
          <div class="dump-sub">
            <span>{{ code }}</span>
            <span class="dump-dot">·</span>
            <span>{{ entry?.at }}</span>
          </div>
        </div>
      </div>

      <div class="dump-section">
        <div class="dump-label">message</div>
        <pre class="dump-pre dump-msg">{{ entry?.message }}</pre>
      </div>

      <div class="dump-section dump-grow">
        <div class="dump-label">stack</div>
        <pre class="dump-pre dump-stack">{{ entry?.stack }}</pre>
      </div>

      <div class="dump-section">
        <div class="dump-label">data</div>
        <pre class="dump-pre">{{ dataText }}</pre>
      </div>

      <div class="dump-foot">
        <span>type: {{ entry?.type }}</span>
        <span class="dump-url">{{ entry?.url }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { makeDumpChartError } from '~/utils/dumpChartError'

definePageMeta({ layout: false })
useHead({ title: 'Error' })

type DumpEntry = ReturnType<typeof makeDumpChartError>
const entry = ref<DumpEntry | null>(null)
const from = ref('/exchange/SAMSUNGUSDT')

const code = computed(() => String((entry.value?.data as any)?.code || ''))
const dataText = computed(() => (entry.value ? JSON.stringify(entry.value.data, null, 2) : ''))

let poll: ReturnType<typeof setInterval> | null = null

// ADMIN에서 덤프오류를 끄면 원래 보던 차트로 돌아간다.
async function checkStillOn() {
  try {
    const cfg = await $fetch<{ enabled: boolean }>('/api/settings/dump-error')
    if (!cfg.enabled) {
      try {
        sessionStorage.removeItem('ktx_dump_error')
      } catch {}
      navigateTo(from.value || '/exchange/SAMSUNGUSDT', { replace: true })
    }
  } catch {
    // 연결이 잠깐 안 돼도 그대로 둔다
  }
}

onMounted(() => {
  try {
    const saved = JSON.parse(sessionStorage.getItem('ktx_dump_error') || 'null')
    if (saved?.entry) entry.value = saved.entry
    if (typeof saved?.from === 'string' && saved.from.startsWith('/')) from.value = saved.from
  } catch {}
  // 주소로 바로 들어오거나 보관된 내용이 없으면 새로 만든다.
  if (!entry.value) {
    const sym = String(from.value.split('/').pop() || 'SAMSUNGUSDT').split('?')[0] || 'SAMSUNGUSDT'
    entry.value = makeDumpChartError(sym)
    try {
      sessionStorage.setItem('ktx_dump_error', JSON.stringify({ entry: entry.value, from: from.value }))
    } catch {}
  }
  checkStillOn()
  poll = setInterval(checkStillOn, 30_000)
})
onBeforeUnmount(() => {
  if (poll) clearInterval(poll)
})
</script>

<style scoped>
/* 사이트 색 테마(화이트/반전 필터)와 상관없이 항상 같은 모습이 되도록 이 페이지 안에서만 색을 정한다. */
.dump {
  position: fixed;
  inset: 0;
  z-index: 10002;
  overflow: auto;
  background: #0b0510;
  color: #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
}
.dump-wrap {
  display: flex;
  min-height: 100%;
  max-width: 72rem;
  margin: 0 auto;
  flex-direction: column;
  gap: 14px;
  padding: 20px 16px 24px;
}
.dump-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(244, 63, 94, 0.3);
}
.dump-icon {
  font-size: 22px;
  line-height: 1;
  color: #fb7185;
}
.dump-head-text {
  min-width: 0;
}
.dump-title {
  font-size: 18px;
  font-weight: 700;
  color: #fda4af;
  word-break: break-all;
}
.dump-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}
.dump-dot {
  margin: 0 6px;
}
.dump-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.dump-grow {
  flex: 1;
}
.dump-label {
  margin-bottom: 4px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f43f5e;
}
.dump-pre {
  margin: 0;
  padding: 10px 12px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 11.5px;
  line-height: 1.6;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}
.dump-msg {
  color: #fecdd3;
}
.dump-stack {
  flex: 1;
  color: #cbd5e1;
}
.dump-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  font-size: 11px;
  color: #475569;
}
.dump-url {
  word-break: break-all;
}
</style>
