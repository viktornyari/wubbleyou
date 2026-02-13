<script setup>
import { useComments } from '../composables/useComments.js'

const props = defineProps({
  sections: { type: Array, required: true },
  activeSectionId: { type: String, default: null },
})

const { getThreadCount } = useComments()

function scrollToSection(sectionId) {
  const el = document.getElementById(`section-${sectionId}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <nav class="py-6 px-3">
    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-4">
      Contents
    </p>

    <ul class="space-y-0.5">
      <li v-for="section in sections" :key="section.id">
        <button
          @click="scrollToSection(section.id)"
          class="w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer"
          :class="[
            activeSectionId === section.id
              ? 'bg-[#edfbff] text-blue-700 font-medium'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
          ]"
        >
          <span class="truncate leading-snug">{{ section.title }}</span>
          <span
            v-if="getThreadCount(section.id) > 0"
            class="shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            :class="
              activeSectionId === section.id
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-100 text-gray-500'
            "
          >
            {{ getThreadCount(section.id) }}
          </span>
        </button>
      </li>
    </ul>

    <div class="mt-8 mx-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
      <p class="text-[11px] text-gray-400 leading-relaxed">
        Click on any section in the document to leave a comment or question.
      </p>
    </div>
  </nav>
</template>
