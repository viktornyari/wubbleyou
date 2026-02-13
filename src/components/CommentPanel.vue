<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useComments, currentUser } from '../composables/useComments.js'
import CommentThread from './CommentThread.vue'

const props = defineProps({
  section: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const { getComments, addComment, addReply } = useComments()

const newCommentText = ref('')
const commentInputEl = ref(null)

const comments = computed(() => {
  if (!props.section) return []
  return getComments(props.section.id)
})

watch(
  () => props.section?.id,
  async () => {
    newCommentText.value = ''
    await nextTick()
    commentInputEl.value?.focus()
  }
)

function submitComment() {
  if (!newCommentText.value.trim() || !props.section) return
  addComment(props.section.id, newCommentText.value)
  newCommentText.value = ''
  nextTick(() => {
    commentInputEl.value?.focus()
  })
}

function handleReply(commentId, text) {
  if (!props.section) return
  addReply(props.section.id, commentId, text)
}
</script>

<template>
  <div class="flex flex-col h-full bg-white">
    <div class="shrink-0 px-5 py-4 border-b border-gray-100">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Comments on
          </p>
          <h3 class="text-sm font-semibold text-gray-900 leading-snug">{{ section?.title }}</h3>
        </div>
        <button
          @click="$emit('close')"
          class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Close (Esc)"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto comment-panel-scroll px-5 py-5">
      <div v-if="comments.length > 0" class="space-y-6">
        <CommentThread
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @reply="handleReply"
        />
      </div>

      <div v-else class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-500 mb-1">No comments yet</p>
        <p class="text-xs text-gray-400 leading-relaxed max-w-[200px]">
          Share your thoughts or questions about this section below.
        </p>
      </div>
    </div>

    <div class="shrink-0 border-t border-gray-100 px-5 py-4 bg-gray-50/50">
      <div class="flex gap-3">
        <img v-if="currentUser.avatar" :src="currentUser.avatar" :alt="currentUser.name" class="shrink-0 w-8 h-8 rounded-full object-cover" />
        <div v-else class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-amber-100 text-amber-700">
          {{ currentUser.initials }}
        </div>
        <div class="flex-1">
          <textarea
            ref="commentInputEl"
            v-model="newCommentText"
            @keydown.enter.exact.prevent="submitComment"
            placeholder="Leave a comment…"
            rows="3"
            class="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 leading-relaxed"
          ></textarea>
          <div class="flex items-center justify-between mt-2">
            <p class="text-[11px] text-gray-400">
              <kbd class="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">Enter</kbd> to send
            </p>
            <button
              @click="submitComment"
              :disabled="!newCommentText.trim()"
              class="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-[#5575FA] to-[#3d5de8] text-white rounded-lg hover:from-[#3d5de8] hover:to-[#2f4fd6] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
