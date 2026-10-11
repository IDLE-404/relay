# Relay

<p align="center">
  <a href="README.md">English</a> | <b>Русский</b>
</p>

Лендинг **Relay**, концепт-сервиса для оркестрации ИИ-агентов через MCP (Model Context Protocol). Проект для портфолио.

**Демо:** https://idle-404.github.io/relay/

## Возможности

- Анимированный первый экран с живой схемой MCP
- Секции «Зачем MCP», проблемы, как это работает, для кого
- Интерактивный редактор схем на React Flow
- Превью консоли с bento-виджетами
- Демо-вход: гостевой режим, регистрация и вход, защищённый маршрут `/console`
- Английский и русский, русский загружается по требованию
- Анимации при прокрутке с учётом `prefers-reduced-motion`
- Свои шрифты, анимации останавливаются вне экрана

## Стек

React 19, TypeScript, Vite, React Router, CSS Modules, @xyflow/react, react-icons.

## Запуск

```bash
npm install
npm run dev
```

Другие команды:

- `npm run build` — сборка в `dist`
- `npm run preview` — локальный просмотр сборки
- `npm run lint` — ESLint

## Структура

```
src/
  app/         роутер и провайдеры
  components/  общие компоненты (Header, FlowEditor, UserMenu…)
  layouts/     MainLayout с шапкой и футером
  pages/       home, signin, console; каждая страница собрана из своих компонентов
  shared/      auth, i18n, хуки, хранилище, конфиг
  styles/      переменные, шрифты, глобальные стили
```

Каждый компонент лежит в своей папке: `Component.tsx`, `Component.module.css`, `index.ts`.

## Деплой

Каждый push в `main` собирает сайт и публикует его на GitHub Pages (`.github/workflows/deploy.yml`). Базовый путь `/relay/` задан в `vite.config.ts`. При сборке `index.html` копируется в `404.html`, поэтому прямые ссылки вроде `/relay/console` работают.

## О демо-входе

Вход работает только в браузере. Аккаунты хранятся в `localStorage`, пароли хешируются SHA-256 с солью. Это демонстрация, для настоящей авторизации нужен сервер.
