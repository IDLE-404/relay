# Relay

<p align="center">
  <b>English</b> | <a href="README.ru.md">Русский</a>
</p>

Landing page for **Relay**, a concept service that orchestrates AI agents over MCP (Model Context Protocol). A portfolio project.

**Live demo:** https://idle-404.github.io/relay/

## Features

- Animated hero with a live MCP flow canvas
- "Why MCP" explainer, challenges, how it works and audiences sections
- Interactive flow editor built with React Flow
- Console preview with bento widgets
- Demo sign-in: guest mode, sign up and sign in, protected `/console` route
- English and Russian, Russian loads on demand
- Scroll reveal animations that respect `prefers-reduced-motion`
- Self-hosted fonts, animations pause off screen

## Stack

React 19, TypeScript, Vite, React Router, CSS Modules, @xyflow/react, react-icons.

## Start

```bash
npm install
npm run dev
```

Other commands:

- `npm run build` — production build into `dist`
- `npm run preview` — serve the build locally
- `npm run lint` — ESLint

## Structure

```
src/
  app/         router and providers
  components/  shared components (Header, FlowEditor, UserMenu…)
  layouts/     MainLayout with header and footer
  pages/       home, signin, console; each page is built from its own components
  shared/      auth, i18n, hooks, storage, config
  styles/      variables, fonts, global styles
```

Every component lives in its own folder: `Component.tsx`, `Component.module.css`, `index.ts`.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). The base path is `/relay/` in `vite.config.ts`. The build copies `index.html` to `404.html`, so deep links like `/relay/console` work.

## About the demo sign-in

Sign-in runs in the browser only. Accounts are stored in `localStorage`, passwords are hashed with SHA-256 and a salt. This is for demonstration, real authentication needs a server.
