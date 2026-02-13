<script setup>
import { ref, watch, nextTick } from 'vue'
import { timeAgo } from '../utils/time.js'
import { currentUser } from '../composables/useComments.js'

const props = defineProps({
  comment: { type: Object, required: true },
})

const emit = defineEmits(['reply'])

const showReplyInput = ref(false)
const replyText = ref('')
const replyInputEl = ref(null)

function isOwn(authorName) {
  return authorName === currentUser.name
}

function getInitialsBg(role) {
  return role === 'team'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-amber-100 text-amber-700'
}

function getAvatar(entry) {
  if (isOwn(entry.author) && currentUser.avatar) return currentUser.avatar
  return entry.avatar || null
}

function submitReply() {
  if (!replyText.value.trim()) return
  emit('reply', props.comment.id, replyText.value)
  replyText.value = ''
  showReplyInput.value = false
}

watch(showReplyInput, async (val) => {
  if (val) {
    await nextTick()
    replyInputEl.value?.focus()
  }
})
</script>

<template>
  <div>
    <div class="flex gap-3">
      <img v-if="getAvatar(comment)" :src="getAvatar(comment)" :alt="comment.author" class="shrink-0 w-8 h-8 rounded-full object-cover" />
      <div
        v-else
        class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
        :class="getInitialsBg(comment.role)"
      >
        {{ comment.initials }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2 mb-1">
          <span class="text-sm font-semibold text-gray-900">
            {{ isOwn(comment.author) ? 'You' : comment.author }}
          </span>
          <span
            v-if="comment.role === 'team'"
            class="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-blue-50 text-[#5575FA] rounded"
          >
            Team
          </span>
          <span class="text-xs text-gray-400">{{ timeAgo(comment.createdAt) }}</span>
        </div>
        <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ comment.text }}</p>

        <button
          @click="showReplyInput = !showReplyInput"
          class="mt-2 text-xs font-medium text-gray-400 hover:text-[#5575FA] transition-colors"
        >
          {{ showReplyInput ? 'Cancel' : 'Reply' }}
        </button>
      </div>
    </div>

    <div v-if="comment.replies.length > 0" class="ml-11 mt-3 space-y-3 border-l-2 border-gray-100 pl-4">
      <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-3">
        <img v-if="getAvatar(reply)" :src="getAvatar(reply)" :alt="reply.author" class="shrink-0 w-7 h-7 rounded-full object-cover" />
        <div
          v-else
          class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold"
          :class="getInitialsBg(reply.role)"
        >
          {{ reply.initials }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline gap-2 mb-0.5">
            <span class="text-sm font-semibold text-gray-900">
              {{ isOwn(reply.author) ? 'You' : reply.author }}
            </span>
            <span
              v-if="reply.role === 'team'"
              class="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-blue-50 text-[#5575FA] rounded"
            >
              Team
            </span>
            <span class="text-xs text-gray-400">{{ timeAgo(reply.createdAt) }}</span>
          </div>
          <p class="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{{ reply.text }}</p>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showReplyInput" class="ml-11 mt-3">
        <div class="flex gap-2">
          <img v-if="currentUser.avatar" :src="currentUser.avatar" :alt="currentUser.name" class="shrink-0 w-7 h-7 rounded-full object-cover" />
          <div v-else class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold bg-amber-100 text-amber-700">
            {{ currentUser.initials }}
          </div>
          <div class="flex-1">
            <textarea
              ref="replyInputEl"
              v-model="replyText"
              @keydown.enter.exact.prevent="submitReply"
              @keydown.escape="showReplyInput = false"
              placeholder="Write a reply…"
              rows="2"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400"
            ></textarea>
            <div class="flex justify-end gap-2 mt-1.5">
              <button
                @click="showReplyInput = false"
                class="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="submitReply"
                :disabled="!replyText.trim()"
                class="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#5575FA] to-[#3d5de8] text-white rounded-md hover:from-[#3d5de8] hover:to-[#2f4fd6] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
