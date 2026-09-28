# waiter-menu-app

Приложение для официантов по изучению меню ресторана. Переходный этап:
за основу взят клон пиццерии dodo, легаси постепенно удаляется.

## Долгосрочная память проекта

Источник правды — Obsidian-vault (вне репозитория):
`C:\Users\ruzin\OneDrive\Obsidian\My_notes\claude-waiter\`

- Начинай сессию с `00-MOC.md` (карта содержания).
- Перед работой над темой читай соответствующую заметку:
  `architecture.md`, `database-prisma.md`, `auth.md`, `ui-kit.md`,
  `api-routes.md`, `state-management.md`, `deployment.md`,
  `legacy-dodo.md`, `roadmap.md`.
- **Протокол:** принято архитектурное решение, добавлена/удалена модель,
  введён паттерн, изменён процесс — ОБНОВИ тематическую заметку vault и
  добавь запись в `decisions.md` (дата, решение, причина). CLAUDE.md не
  расширять — он только указывает на vault.

## Команды

```bash
npm run dev            # dev-сервер (Turbopack), http://localhost:3000
npm run build          # prisma generate && next build --turbopack
npm run prisma:push    # prisma db push  (ОСТОРОЖНО: см. ниже)
npm run prisma:studio  # GUI базы
```

## Критично помнить

- Рабочая ветка `restaurant-menu-architecture-myw60t` = production-ветка
  Vercel: **push → авто-деплой в прод**.
- dev и prod используют ОДНУ базу Neon — `prisma db push` и seed бьют по
  проду (`database-prisma.md`).
- Секреты только в `.env` (не в git); список переменных — `.env.example`.
- Сборка временно игнорирует TS/ESLint-ошибки легаси (`next.config.ts`) —
  не полагаться на build как на проверку типов.
