<template>
  <!-- 상단 메뉴 [이벤트]: 이 사이트에서 진행 중인 이벤트가 있을 때만 보인다(관리자 페이지에서 켜고 끔). -->
  <template v-if="items.length">
    <div v-if="!mobile" class="group relative">
      <NuxtLink
        :to="`/event/${items[0].code}`"
        class="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-[#f0b90b] hover:bg-cyan-400/10 hover:text-[#f0b90b]"
        @click="$emit('navigate', `/event/${items[0].code}`)"
      >
        {{ t('이벤트', 'Events') }}
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f0b90b]" />
      </NuxtLink>
      <div v-if="items.length > 1" class="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
        <div class="min-w-[200px] rounded-xl border border-cyan-500/10 bg-[#03101d] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          <NuxtLink
            v-for="e in items"
            :key="e.code"
            :to="`/event/${e.code}`"
            class="block rounded-lg px-3 py-2 text-[15px] text-slate-200 hover:bg-cyan-400/10 hover:text-white"
            @click="$emit('navigate', `/event/${e.code}`)"
          >
            {{ label(e) }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <template v-else>
      <NuxtLink
        v-for="e in items"
        :key="e.code"
        :to="`/event/${e.code}`"
        class="flex items-center gap-2 rounded-md px-3 py-2.5 text-[#f0b90b] hover:bg-cyan-400/10 hover:text-[#f0b90b]"
        @click="$emit('navigate', `/event/${e.code}`)"
      >
        {{ t('이벤트', 'Event') }} · {{ label(e) }}
      </NuxtLink>
    </template>
  </template>
</template>

<script setup lang="ts">
defineProps<{ mobile?: boolean }>()
defineEmits<{ (e: 'navigate', to: string): void }>()
const { t, locale } = useLocale()
type ActiveEvent = { code: string; name: string; title: string; nameEn?: string; titleEn?: string }
// 영어 화면이면 영어 제목(비어 있으면 한국어)
function label(e: ActiveEvent) {
  const en = String(locale.value || '').toLowerCase().startsWith('en')
  return (en && (e.titleEn || e.nameEn)) || e.title || e.name
}

// 여러 화면(헤더 두 종류, PC/모바일 메뉴)이 같이 쓰므로 한 번만 받아 공유한다.
const items = useState<ActiveEvent[]>('active_events', () => [])
const loaded = useState<boolean>('active_events_loaded', () => false)
onMounted(async () => {
  if (loaded.value) return
  loaded.value = true
  try {
    const res = await $fetch<{ items: ActiveEvent[] }>('/api/events/active')
    items.value = res.items || []
  } catch {
    items.value = []
  }
})
</script>
