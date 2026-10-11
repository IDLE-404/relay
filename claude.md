# Project conventions

Stack: React 19, TypeScript, Vite, React Router 7, CSS Modules, react-icons. NO Tailwind, do not add it.

## Structure
- src/components/ — shared components (Folder/Component.tsx + Component.module.css + index.ts)
- src/pages/<page>/components/ — page-local components, same pattern
- src/layouts/ — MainLayout (header), authLayout
- src/shared/ — hooks, i18n, auth, api, utils, types
- src/styles/variables.css — design tokens; global.css — resets, [data-reveal] animations

## Rules
- Light theme only. Use semantic tokens from variables.css (--surface-*, --border*, --text*, --agent-*, --success/--warning/--danger and their -soft tints), no hardcoded colors. Add new tokens there.
- Text must reach 4.5:1 contrast on its background; the tokens are tuned for it.
- Styling: CSS Modules only.
- All user-facing text goes to src/shared/i18n/en.ts and ru.ts (keep both in sync), read via useI18n().
- Scroll animations: use data-reveal attributes + useReveal() hook.
- Fonts: self-hosted in public/fonts (src/styles/fonts.css). Geist for body and headings, Geist Mono for code, Instrument Serif italic for accent words via <em> (Cyrillic falls back to Cormorant Garamond italic).
- Auth is a client-only demo (src/shared/auth): accounts and session in localStorage via src/shared/storage.ts, passwords as salted SHA-256. /console is behind RequireAuth.
- Assets in public/ must use `${import.meta.env.BASE_URL}file.ext`, never absolute "/file".
- Use @/ alias for imports.
- Animate only transform/opacity; respect prefers-reduced-motion.
- No new dependencies without asking.
- After changes: npm run build && npm run lint must pass.

## Product
Landing for an MCP agent orchestration service: orchestrator routes tasks to agents (Docs, Data, Telegram), each agent uses its own MCP servers (Drive, Postgres, Telegram...). MCP = agent↔tools protocol, not agent↔agent.