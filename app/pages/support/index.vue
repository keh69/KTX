<template>
  <div class="space-y-6">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 class="text-xl font-semibold">{{ t('고객센터', 'Support') }}</h1>
      <p class="mt-2 text-sm text-slate-400">{{ t('고객센터와 쪽지를 주고받을 수 있습니다.', 'Exchange messages with Support.') }}</p>
    </div>

    <div class="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-base font-semibold">{{ t('쪽지함', 'Inbox') }}</h2>
          <button class="rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/15" @click="loadThreads">{{ t('새로고침', 'Refresh') }}</button>
        </div>

        <div class="mt-4 max-h-[680px] space-y-2 overflow-auto">
          <button
            v-for="thread in threads"
            :key="thread.threadKey"
            class="w-full rounded-xl border px-3 py-3 text-left transition"
            :class="activeThread?.threadKey === thread.threadKey ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'"
            @click="openThread(thread)"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="font-medium text-slate-100">{{ t('고객센터', 'Support') }}</div>
              <span v-if="thread.unreadCount" class="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">
                {{ thread.unreadCount }}
              </span>
            </div>
            <div class="mt-1 line-clamp-1 text-xs text-slate-400">{{ messagePreviewText(thread.lastMessage, t('[이미지]', '[Image]')) || t('대화 없음', 'No conversation') }}</div>
            <div class="mt-2 text-[11px] text-slate-500">{{ formatDateTime(thread.lastAt) }}</div>
          </button>
          <div v-if="threads.length === 0" class="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-500">
            {{ t('받은 쪽지가 없습니다.', 'No messages received.') }}
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div class="border-b border-white/10 pb-4">
          <div class="text-base font-semibold text-slate-100">{{ t('고객센터', 'Support') }}</div>
          <div class="mt-1 text-sm text-slate-400">{{ t('문의 내용과 답장을 이곳에서 확인할 수 있습니다.', 'View your inquiries and replies here.') }}</div>
        </div>

        <div ref="messageListEl" class="mt-4 max-h-[440px] space-y-3 overflow-auto pr-1" @scroll.passive="onChatListScroll">
          <div
            v-for="message in activeMessages"
            :key="message.id"
            class="max-w-[85%] rounded-2xl px-4 py-3 text-sm"
            :class="message.sender_id === me?.id ? 'ml-auto bg-cyan-500/15 text-slate-100' : 'bg-white/5 text-slate-200'"
          >
            <div class="mb-1 text-[11px] text-slate-400">
              {{ message.senderName }}<span v-if="message.senderUsername && message.senderName === '관리자'"> ({{ message.senderUsername }})</span>
            </div>
            <div class="whitespace-pre-wrap leading-6">
              <template v-for="(part, pi) in splitMessageBody(message.body)" :key="pi">
                <a v-if="part.type === 'img'" :href="part.src" class="my-1 block w-fit cursor-zoom-in" @click.prevent="previewImage = part.src">
                  <img :src="part.src" alt="" class="max-h-64 max-w-full rounded-lg border border-white/10 bg-white/5" @load="onChatImageLoad" />
                </a>
                <div v-else>{{ part.text }}</div>
              </template>
            </div>
            <div class="mt-2 text-[11px] text-slate-500">{{ formatDateTime(message.created_at) }}</div>
          </div>
          <div v-if="activeMessages.length === 0" class="py-10 text-center text-sm text-slate-500">{{ t('아직 쪽지가 없습니다. 아래에서 새 문의를 보낼 수 있습니다.', 'No messages yet. You can send a new inquiry below.') }}</div>
        </div>

        <div class="mt-5 border-t border-white/10 pt-4">
          <input
            v-model.trim="subject"
            class="mb-3 w-full rounded-md border border-white/10 bg-[#06101b] px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500/40"
            :placeholder="t('제목', 'Subject')"
            :key="`support-subject-${locale}`"
          />
          <textarea
            v-model.trim="body"
            rows="5"
            class="w-full rounded-md border border-white/10 bg-[#06101b] px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500/40"
            :placeholder="t('고객센터에 보낼 내용을 입력하세요', 'Enter the message you want to send to Support')"
            :key="`support-body-${locale}`"
            @paste="onReplyPaste"
          />
          <div v-if="replyImages.length" class="mt-2 flex flex-wrap gap-2">
            <div v-for="(img, ii) in replyImages" :key="img.id" class="relative">
              <img
                      :src="img.dataUrl"
                      alt=""
                      class="h-16 w-16 cursor-zoom-in rounded-md border border-white/10 object-cover hover:border-cyan-400/50"
                      @click="previewImage = img.dataUrl"
                    />
              <button
                type="button"
                class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[12px] leading-none text-slate-200 ring-1 ring-white/20 hover:bg-rose-600"
                @click="removeReplyImage(ii)"
              >
                ×
              </button>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <input ref="replyFileInput" type="file" accept="image/*,.bmp" multiple class="hidden" @change="onReplyFilePick" />
              <button
                type="button"
                class="rounded-md bg-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="replyImages.length >= MESSAGE_ATTACH_MAX"
                @click="replyFileInput?.click()"
              >
                {{ t('첨부파일 추가', 'Add Attachment') }}
              </button>
              <span class="text-[12px] text-slate-500">{{ t('이미지는 Ctrl+V로 붙여넣을 수도 있습니다.', 'You can also paste images with Ctrl+V.') }}</span>
            </div>
            <button
              class="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="sending || (!body && !replyImages.length)"
              @click="sendMessage"
            >
              {{ sending ? t('전송 중...', 'Sending...') : t('보내기', 'Send') }}
            </button>
          </div>
          <p v-if="replyAttachError" class="mt-3 text-sm text-rose-300">{{ replyAttachError }}</p>
          <p v-if="error" class="mt-3 text-sm text-rose-300">{{ error }}</p>
          <p v-if="okText" class="mt-3 text-sm text-emerald-300">{{ okText }}</p>
        </div>
      </section>
    </div>
    <Teleport to="body">
      <div
        v-if="previewImage"
        class="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/80 p-4"
        @click="previewImage = null"
      >
        <img :src="previewImage" alt="" class="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl" />
        <button
          type="button"
          class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xl leading-none text-white hover:bg-white/25"
          @click.stop="previewImage = null"
        >
          ×
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { MESSAGE_ATTACH_MAX, imageFileToDataUrl, imageFilesFromClipboard, messagePreviewText, splitMessageBody } from '~/utils/messageBody'
definePageMeta({ middleware: ['auth'] })

const { t, locale } = useLocale()

type ThreadSummary = {
  threadKey: string
  userId: number
  username: string
  lastMessage: string
  lastAt: string
  unreadCount: number
  subject: string
}
type MessageItem = {
  id: number
  sender_id: number
  senderName: string
  senderUsername?: string
  body: string
  created_at: string
}

const { me, refresh } = useMe()
await refresh()
const { refreshUnread } = useMessages()

const threads = ref<ThreadSummary[]>([])
const activeThread = ref<ThreadSummary | null>(null)
const activeMessages = ref<MessageItem[]>([])
const subject = ref('')
const body = ref('')
const sending = ref(false)
const error = ref<string | null>(null)
const okText = ref<string | null>(null)
const messageListEl = ref<HTMLElement | null>(null)

// ── 고객센터 쪽지 이미지 첨부: Ctrl+V 붙여넣기 / [첨부파일 추가] (비회원 상담은 제외) ──
type PendingImage = { id: number; dataUrl: string }
const replyImages = ref<PendingImage[]>([])
// 첨부한 그림(보내기 전 미리보기)과 대화창 안의 그림을 누르면 팝업으로 크게 보여준다. 바깥을 누르거나 Esc로 닫힘.
const previewImage = ref<string | null>(null)
function onPreviewKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && previewImage.value) previewImage.value = null
}
onMounted(() => window.addEventListener('keydown', onPreviewKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onPreviewKey))
const replyAttachError = ref<string | null>(null)
const replyFileInput = ref<HTMLInputElement | null>(null)
let pendingImageSeq = 0
async function addReplyFiles(files: File[]) {
  replyAttachError.value = null
  for (const f of files) {
    if (replyImages.value.length >= MESSAGE_ATTACH_MAX) {
      replyAttachError.value = t(`이미지는 한 번에 ${MESSAGE_ATTACH_MAX}장까지 보낼 수 있습니다.`, `You can send up to ${MESSAGE_ATTACH_MAX} images at once.`)
      break
    }
    if (!f.type.startsWith('image/') && !/\.(bmp|jpe?g|png|gif|webp)$/i.test(f.name)) {
      replyAttachError.value = t('이미지 파일만 첨부할 수 있습니다.', 'Only image files can be attached.')
      continue
    }
    try {
      replyImages.value.push({ id: ++pendingImageSeq, dataUrl: await imageFileToDataUrl(f) })
    } catch {
      replyAttachError.value = t('이미지를 불러오지 못했습니다.', 'Failed to load the image.')
    }
  }
}
function onReplyPaste(e: ClipboardEvent) {
  const files = imageFilesFromClipboard(e)
  if (!files.length) return
  // 그림만 복사한 경우에는 기본 붙여넣기(파일 이름 글자 등)를 막고 그림만 첨부한다.
  if (!e.clipboardData?.getData('text/plain')) e.preventDefault()
  addReplyFiles(files)
}
function onReplyFilePick(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  addReplyFiles(files)
}
function removeReplyImage(index: number) {
  if (previewImage.value === replyImages.value[index]?.dataUrl) previewImage.value = null
  replyImages.value.splice(index, 1)
  replyAttachError.value = null
}
// 대화창을 맨 아래로 보고 있을 때 그림이 늦게 뜨면(높이가 늘어나면) 다시 맨 아래로 맞춘다.
let chatStickBottom = true
function onChatListScroll(e: Event) {
  const el = e.target as HTMLElement
  chatStickBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
}
function onChatImageLoad() {
  if (chatStickBottom && messageListEl.value) messageListEl.value.scrollTop = messageListEl.value.scrollHeight
}

// 대화를 열거나 새 쪽지를 받으면 가장 최근 쪽지(맨 아래)가 보이게 한다.
watch(activeMessages, () => {
  nextTick(() => {
    chatStickBottom = true
    if (messageListEl.value) messageListEl.value.scrollTop = messageListEl.value.scrollHeight
  })
})

function formatDateTime(v: string) {
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v || ''
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d)
}

// SSR(주소창 직접 접속/새로고침)에서는 브라우저 쿠키가 자동으로 전달되지 않으므로 명시적으로 넘겨야
// 로그인 상태인데도 쪽지 API가 401로 실패하는 문제를 막을 수 있다.
function ssrHeaders() {
  return import.meta.server ? useRequestHeaders(['cookie']) : undefined
}

async function loadThreads() {
  const res = await $fetch<{ items: ThreadSummary[] }>('/api/messages/threads', { headers: ssrHeaders(), credentials: 'include' })
  threads.value = res.items || []
  if (!activeThread.value && threads.value.length) {
    await openThread(threads.value[0], false)
  }
}

async function openThread(thread: ThreadSummary, refreshList = true) {
  activeThread.value = thread
  const res = await $fetch<{ items: MessageItem[] }>('/api/messages/thread', { headers: ssrHeaders(), credentials: 'include' })
  activeMessages.value = res.items || []
  await $fetch('/api/messages/mark-read', { method: 'POST', body: {} }).catch(() => {})
  await refreshUnread()
  if (refreshList) await loadThreads()
}

async function sendMessage() {
  if (!body.value.trim() && !replyImages.value.length) return
  sending.value = true
  error.value = null
  okText.value = null
  try {
    await $fetch('/api/messages/send', {
      method: 'POST',
      body: {
        subject: subject.value.trim(),
        body: body.value.trim(),
        images: replyImages.value.map((img) => img.dataUrl)
      }
    })
    subject.value = ''
    body.value = ''
    replyImages.value = []
    okText.value = t('쪽지를 보냈습니다.', 'Message sent.')
    await loadThreads()
    if (threads.value[0]) await openThread(threads.value[0], false)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || t('쪽지를 보내지 못했습니다.', 'Failed to send message.')
  } finally {
    sending.value = false
  }
}

// 관리자 계정은 회원용 고객지원 화면(내 쪽지함)이 없다. 대화 상대(userId) 없이 대화를 불러오면 서버가 400을 돌려주므로,
// 관리자는 쪽지관리 화면으로 보내고 이 화면의 쪽지 불러오기는 건너뛴다.
if (me.value && me.value.role !== 'user') {
  // 관리자 고객센터는 ADMIN 사이트에 있다(거래소 안의 /admin 화면은 막혀 있음).
  await navigateTo(ADMIN_SUPPORT_URL, { external: true })
} else {
  await loadThreads()
  await refreshUnread()
}

// 상단 "새 쪽지가 도착했습니다" 팝업을 누르면 ?open= 으로 들어온다 → 이미 이 화면에 있어도 대화를 새로 불러와 바로 읽음 처리한다.
const route = useRoute()
const router = useRouter()
async function openLatestThread() {
  const res = await $fetch<{ items: ThreadSummary[] }>('/api/messages/threads', { credentials: 'include' }).catch(() => null)
  if (res) threads.value = res.items || []
  if (threads.value[0]) await openThread(threads.value[0], false)
  const { open: _o, ...rest } = route.query
  router.replace({ query: rest }).catch(() => {})
}
onMounted(() => {
  if (route.query.open && me.value?.role === 'user') openLatestThread()
})
watch(
  () => route.query.open,
  (v, old) => {
    if (process.client && v && v !== old) openLatestThread()
  }
)
</script>
