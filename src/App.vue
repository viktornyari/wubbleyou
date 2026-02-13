<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { project, sections } from './data/scopeOfWork.js'
import { useComments } from './composables/useComments.js'
import AppHeader from './components/AppHeader.vue'
import TableOfContents from './components/TableOfContents.vue'
import DocumentSection from './components/DocumentSection.vue'
import CommentPanel from './components/CommentPanel.vue'

const { activeSectionId, setActiveSection, closePanel } = useComments()

const activeSection = computed(() => {
  if (!activeSectionId.value) return null
  return sections.find((s) => s.id === activeSectionId.value) || null
})

const isPanelOpen = computed(() => !!activeSectionId.value)

function handleOpenComments(sectionId) {
  setActiveSection(sectionId)
}

function handleKeydown(e) {
  if (e.key === 'Escape' && isPanelOpen.value) {
    closePanel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="min-h-screen bg-stone-50/50 font-sans antialiased">
    <div class="fixed top-0 left-0 right-0 z-40">
      <AppHeader :project="project" />
    </div>

    <div class="pt-16 flex">
      <aside
        class="fixed left-0 top-16 w-60 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 overflow-y-auto z-30"
      >
        <TableOfContents
          :sections="sections"
          :activeSectionId="activeSectionId"
        />
      </aside>

      <main
        class="ml-60 flex-1 transition-all duration-300 ease-in-out"
        :class="isPanelOpen ? 'mr-[400px]' : 'mr-0'"
      >
        <div class="max-w-3xl mx-auto py-10 px-8">
          <div class="mb-10">
            <h1 class="text-[28px] font-bold text-gray-900 tracking-tight leading-tight">
              {{ project.name }}
            </h1>
            <div class="flex items-center gap-2 mt-3 text-sm text-gray-400">
              <span>Prepared by <span class="text-gray-600 font-medium">{{ project.preparedBy }}</span></span>
              <span>·</span>
              <span>{{ project.date }}</span>
              <span>·</span>
              <span>v{{ project.version }}</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/[0.04] px-10 py-6">
            <template v-for="(section, index) in sections" :key="section.id">
              <DocumentSection
                :section="section"
                :isActive="activeSectionId === section.id"
                @open-comments="handleOpenComments"
              />
              <hr
                v-if="index < sections.length - 1"
                class="my-1 border-gray-100/80"
              />
            </template>
          </div>

          <div class="mt-10 mb-16 text-center">
            <p class="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
              This document is confidential and intended solely for the named recipient.
              Please review all sections and leave any comments or questions before approving.
            </p>
          </div>
        </div>
      </main>

      <Transition name="panel">
        <aside
          v-if="isPanelOpen"
          class="fixed right-0 top-16 w-[400px] h-[calc(100vh-4rem)] border-l border-gray-200 shadow-xl z-30 bg-white"
        >
          <CommentPanel :section="activeSection" @close="closePanel" />
        </aside>
      </Transition>
    </div>
  </div>
</template>
