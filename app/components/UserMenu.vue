<template>
  <!-- 상단 오른쪽 사람 아이콘: 마우스를 올리면(또는 누르면) 아이디 / 내 정보 / 로그아웃 메뉴가 뜬다. -->
  <div class="relative" @mouseenter="open = true" @mouseleave="open = false">
    <button
      type="button"
      class="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
      :aria-label="t('내 계정', 'My account')"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg viewBox="0 0 24 24" class="h-[21px] w-[21px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="12" cy="10" r="3.2" />
        <path d="M6.2 18.6c1.3-2.3 3.4-3.6 5.8-3.6s4.5 1.3 5.8 3.6" />
      </svg>
    </button>
    <!-- pt-2: 아이콘과 메뉴 사이를 지나가는 동안 메뉴가 닫히지 않게 하는 여백 -->
    <div v-show="open" class="absolute right-0 top-full z-50 pt-2">
      <div class="min-w-[180px] rounded-xl border border-cyan-500/10 bg-[#03101d] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
        <div class="truncate px-3 pb-2 pt-1 text-[16px] font-bold text-white">{{ me?.username }}</div>
        <div class="mx-1 mb-1 h-px bg-white/10" />
        <NuxtLink
          to="/profile"
          class="block rounded-lg px-3 py-2 text-[15px] text-slate-200 hover:bg-cyan-400/10 hover:text-white"
          @click="go('/profile')"
        >
          {{ t('내 정보', 'My Info') }}
        </NuxtLink>
        <button
          type="button"
          class="block w-full rounded-lg px-3 py-2 text-left text-[15px] text-slate-200 hover:bg-cyan-400/10 hover:text-white"
          @click="onLogout"
        >
          {{ t('로그아웃', 'Log Out') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'navigate', to: string): void; (e: 'logout'): void }>()
const { t } = useLocale()
const { me } = useMe()
const open = ref(false)
const route = useRoute()
// 다른 화면으로 옮기면 메뉴를 닫는다.
watch(
  () => route.fullPath,
  () => {
    open.value = false
  }
)
function go(to: string) {
  open.value = false
  emit('navigate', to)
}
function onLogout() {
  open.value = false
  emit('logout')
}
</script>
