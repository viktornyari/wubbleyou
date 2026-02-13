import { reactive, computed } from 'vue'

export const currentUser = {
  name: 'Alex Morgan',
  role: 'client',
  initials: 'AM',
  avatar: '/avatar-mark.png',
}

const state = reactive({
  comments: {},
  activeSectionId: null,
})

function seedComments() {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
  const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000)
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)

  state.comments = {
    'phase-2': [
      {
        id: 'seed-1',
        author: 'Alex Morgan',
        role: 'client',
        initials: 'AM',
        text: 'Can we prioritise the barcode scanning feature? The warehouse team has been asking about this specifically - it would be a big win to get it working early in this phase.',
        createdAt: twoHoursAgo,
        replies: [
          {
            id: 'seed-1-reply-1',
            author: 'Sarah Chen',
            role: 'team',
            initials: 'SC',
            avatar: '/avatar-sarah.png',
            text: "Absolutely - we can move barcode scanning to the first sprint of Phase 2. We'll have a working prototype ready for you to test by Week 5.",
            createdAt: oneHourAgo,
          },
          {
            id: 'seed-1-reply-2',
            author: 'Alex Morgan',
            role: 'client',
            initials: 'AM',
            text: 'Perfect, that works well. Thanks Sarah.',
            createdAt: thirtyMinAgo,
          },
        ],
      },
    ],
    'timeline': [
      {
        id: 'seed-2',
        author: 'Alex Morgan',
        role: 'client',
        initials: 'AM',
        text: "The fortnightly check-ins work for me. Could we also get a brief progress update at Week 4? I'd like to see how things are going before the mid-project review.",
        createdAt: oneHourAgo,
        replies: [],
      },
    ],
    'assumptions': [
      {
        id: 'seed-3',
        author: 'Alex Morgan',
        role: 'client',
        initials: 'AM',
        text: "The API documentation for our current systems might take a bit longer than Week 4 - our tech team is stretched thin at the moment. Is there any flexibility here?",
        createdAt: twoHoursAgo,
        replies: [
          {
            id: 'seed-3-reply-1',
            author: 'Sarah Chen',
            role: 'team',
            initials: 'SC',
            avatar: '/avatar-sarah.png',
            text: "No problem at all. We can start development with mock data and switch to the real APIs once the documentation is ready. As long as we have it by Week 6, we'll stay on track.",
            createdAt: oneHourAgo,
          },
        ],
      },
    ],
  }
}

seedComments()

export function useComments() {
  const addComment = (sectionId, text) => {
    if (!text.trim()) return

    if (!state.comments[sectionId]) {
      state.comments[sectionId] = []
    }

    state.comments[sectionId].push({
      id: `comment-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      initials: currentUser.initials,
      text: text.trim(),
      createdAt: new Date(),
      replies: [],
    })
  }

  const addReply = (sectionId, commentId, text) => {
    if (!text.trim()) return

    const comments = state.comments[sectionId]
    if (!comments) return

    const comment = comments.find((c) => c.id === commentId)
    if (!comment) return

    comment.replies.push({
      id: `reply-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      initials: currentUser.initials,
      text: text.trim(),
      createdAt: new Date(),
    })
  }

  const getComments = (sectionId) => {
    return state.comments[sectionId] || []
  }

  const getThreadCount = (sectionId) => {
    return (state.comments[sectionId] || []).length
  }

  const setActiveSection = (sectionId) => {
    state.activeSectionId = state.activeSectionId === sectionId ? null : sectionId
  }

  const closePanel = () => {
    state.activeSectionId = null
  }

  const activeSectionId = computed(() => state.activeSectionId)

  const totalComments = computed(() => {
    return Object.values(state.comments).reduce((total, comments) => {
      return total + comments.reduce((count, c) => count + 1 + c.replies.length, 0)
    }, 0)
  })

  return {
    addComment,
    addReply,
    getComments,
    getThreadCount,
    setActiveSection,
    closePanel,
    activeSectionId,
    totalComments,
    comments: state.comments,
  }
}
