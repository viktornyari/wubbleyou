<script setup>
import { computed } from 'vue'
import { useComments } from '../composables/useComments.js'

const props = defineProps({
  section: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
})

const emit = defineEmits(['open-comments'])

const { getThreadCount } = useComments()

const threadCount = computed(() => getThreadCount(props.section.id))
const hasComments = computed(() => threadCount.value > 0)
</script>

<template>
  <section
    :id="`section-${section.id}`"
    class="group relative py-8 -mx-3 px-3 rounded-xl transition-all duration-200"
    :class="[
      isActive
        ? 'bg-[#edfbff] ring-1 ring-blue-100'
        : 'hover:bg-gray-50/60',
    ]"
  >
    <div class="pr-16">
      <div class="mb-4">
        <h2 class="text-xl font-semibold text-gray-900 tracking-tight leading-snug">
          {{ section.title }}
        </h2>
        <p v-if="section.subtitle" class="text-sm font-medium text-[#5575FA] mt-1">
          {{ section.subtitle }}
        </p>
      </div>

      <div v-if="section.type === 'text'" class="space-y-4">
        <p
          v-for="(para, i) in section.content"
          :key="i"
          class="text-[15px] text-gray-600 leading-[1.75]"
        >
          {{ para }}
        </p>
      </div>

      <div v-if="section.type === 'phase'">
        <p class="text-[15px] text-gray-600 leading-[1.75] mb-5">{{ section.content }}</p>

        <div class="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Deliverables
          </p>
          <ul class="space-y-2.5">
            <li
              v-for="(item, i) in section.deliverables"
              :key="i"
              class="flex gap-3 text-sm text-gray-700"
            >
              <svg
                class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="leading-relaxed">{{ item }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-[#edfbff] text-blue-700 rounded-full text-xs font-medium">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ section.duration }}
        </div>
      </div>

      <div v-if="section.type === 'timeline'">
        <p class="text-[15px] text-gray-600 leading-[1.75] mb-6">{{ section.content }}</p>

        <div class="space-y-0">
          <div
            v-for="(milestone, i) in section.milestones"
            :key="i"
            class="flex gap-4 relative"
          >
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full bg-[#5575FA] ring-4 ring-blue-50 shrink-0 z-10 mt-0.5"></div>
              <div
                v-if="i < section.milestones.length - 1"
                class="w-0.5 bg-blue-100 flex-1 min-h-8"
              ></div>
            </div>
            <div class="pb-6">
              <p class="text-xs font-bold text-[#5575FA] uppercase tracking-wider">
                {{ milestone.week }}
              </p>
              <p class="text-sm text-gray-700 mt-0.5 leading-relaxed">{{ milestone.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="section.type === 'investment'">
        <p class="text-[15px] text-gray-600 leading-[1.75] mb-5">{{ section.content }}</p>

        <div class="space-y-3">
          <div
            v-for="(payment, i) in section.payments"
            :key="i"
            class="flex items-center justify-between py-3.5 px-4 bg-gray-50/80 rounded-xl border border-gray-100"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">{{ payment.milestone }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ payment.timing }}</p>
            </div>
            <p class="text-lg font-semibold text-gray-900 tabular-nums">{{ payment.amount }}</p>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between py-3.5 px-4 bg-[#edfbff] rounded-xl border border-blue-100">
          <p class="text-sm font-semibold text-blue-900">Total investment</p>
          <p class="text-xl font-bold text-blue-900 tabular-nums">{{ section.total }}</p>
        </div>

        <p v-if="section.note" class="mt-4 text-xs text-gray-500 leading-relaxed">
          {{ section.note }}
        </p>
      </div>

      <div v-if="section.type === 'list'">
        <p class="text-[15px] text-gray-600 leading-[1.75] mb-4">{{ section.content }}</p>

        <ul class="space-y-3">
          <li
            v-for="(item, i) in section.items"
            :key="i"
            class="flex gap-3 text-sm text-gray-700"
          >
            <span class="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
              {{ i + 1 }}
            </span>
            <span class="leading-relaxed">{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="absolute right-3 top-8">
      <button
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
        :class="[
          isActive
            ? 'bg-blue-200/60 text-blue-700'
            : hasComments
              ? 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
              : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-gray-100 hover:text-gray-600',
        ]"
        @click.stop="$emit('open-comments', section.id)"
        :title="hasComments ? `${threadCount} comment thread${threadCount !== 1 ? 's' : ''}` : 'Add a comment'"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <span v-if="hasComments">{{ threadCount }}</span>
      </button>
    </div>
  </section>
</template>
