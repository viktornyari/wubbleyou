<script setup>
import { useComments } from '../composables/useComments.js'

const props = defineProps({
  project: { type: Object, required: true },
})

const { totalComments } = useComments()
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 select-none">
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2.5">
        <img
          src="/wu-logo.png"
          alt="Wubbleyou"
          class="w-8 h-8 rounded-lg object-cover"
        />
        <div>
          <h1 class="text-sm font-semibold text-gray-900 leading-tight">Scope of Work</h1>
          <p class="text-[11px] text-gray-500">{{ project.client }}</p>
        </div>
      </div>

      <div class="h-6 w-px bg-gray-200"></div>

      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200/60">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        {{ project.status }}
      </span>
    </div>

    <div class="flex items-center gap-5">
      <div v-if="totalComments > 0" class="flex items-center gap-1.5 text-xs text-gray-500">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <span>{{ totalComments }} comment{{ totalComments !== 1 ? 's' : '' }}</span>
      </div>

      <div class="flex items-center gap-2.5">
        <span class="text-xs text-gray-500 font-medium">Alex Morgan</span>
        <img src="/avatar-mark.png" alt="Alex Morgan" class="w-8 h-8 rounded-full object-cover" />
      </div>
    </div>
  </header>
</template>
