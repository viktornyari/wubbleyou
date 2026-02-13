# Scope of Work Review Tool

Internal tool for Wubbleyou that gives clients a clean way to review Scope of Work documents and leave feedback on specific sections.

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. For a production build: `npm run build && npm run preview`.

## Design decisions

**Document-first layout**: The SOW is presented as a paper-style card on a neutral background. The goal was to make it feel like reading a real proposal rather than navigating a web app. Clients shouldn't have to learn a new tool just to review a document.

**Section-level commenting**: Comments are tied to individual sections instead of being dumped into one big thread. This keeps discussions focused and makes it obvious which part of the scope someone is talking about.

**Slide-in panel**: The comment panel opens from the right so the document stays visible. You can reference the section content while writing your feedback without switching contexts.

**No backend (yet)**: Comments live in reactive state and reset on reload. For the current use case of reviewing a single document in a session, this keeps things simple. Persistence would be the obvious next step.

**Tailwind + Vue Composition API**: Tailwind v4 for quick, consistent styling without a separate design system. Vue's `<script setup>` and a single `useComments` composable keep things lightweight — no need for Pinia or Vuex at this scale.

## Assumptions

- This is used internally between Wubbleyou and their clients, so there's no auth flow.
- SOW content is static (defined in `src/data/scopeOfWork.js`). A real version would pull this from an API.
- Desktop/tablet is the primary use case. The fixed sidebar assumes a reasonable screen width.
- Single reviewer per session. Multi-user and real-time collaboration aren't needed right now.

## Next steps

- Hook up a backend to persist comments across sessions
- Real-time updates so multiple people can review simultaneously
- Auth so reviewers are properly identified
- Per-section approval/sign-off workflow with a progress indicator
- Responsive layout for mobile (collapsible sidebar, stacked comment panel)
- Rich text and file attachments in comments
- Notifications when new comments come in
