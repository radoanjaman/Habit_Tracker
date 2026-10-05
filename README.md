# Habit Tracker

A premium dark-mode personal habit & goal tracker built with React, Vite, TypeScript, Tailwind, Zustand, React Hook Form + Zod, date-fns and Recharts. Data is stored in `localStorage`.

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

(On Windows PowerShell with script execution disabled, use `npm.cmd`.)

## Features

- **Dashboard** – greeting, dynamic daily progress ring (completed/total), working checklist, Add Goal modal, weekly snapshot, "Most Used Goals" (horizontal scroll on mobile; click to prefill the Add Goal form).
- **Map** – Week / Month planner. Month calendar is computed with date-fns (Monday-first, leap-year safe), prev/next navigation, today + selected markers, per-day completed / partial / missed / planned indicators (distinct shapes, not color-only). Selecting a day lists its goals; you can toggle, edit, delete, or add goals to that day.
- **Scheduling** – goals can be one day, every day, weekdays, or specific days (e.g. "Every Monday", "3 days/week" preset). Data model: `Goal.frequency: { type, days }`.
- **History** – weekly & monthly (Recharts) overview, completed/missed/partial counts, dynamic current & longest streak, per-goal performance, per-day overview.
- **Mine** – editable profile (validated per field) persisted locally.
- **Settings** (`/settings`, via gear icon) – notifications switch, reminder mode, export JSON, load demo data, clear all data (with confirmation).
- Error handling: corrupted / unavailable localStorage is tolerated; invalid persisted records are filtered; form validation with Zod.
- Accessibility: semantic markup, native checkboxes, `aria-label`s on icon buttons, focus rings, modal focus trap + Escape, status shapes + text.

## Architecture

```
src/
  types/        domain interfaces (UserProfile, Goal, GoalSchedule, GoalCompletion, AppSettings)
  lib/          pure logic: dates, stats (progress/streak), schema (zod), seed (demo data), storage adapter
  store/        Zustand tracker store (persisted) + UI store (modal state)
  hooks/        useStats – memoized derived stats
  components/   layout, dashboard, goals, calendar, history, profile, settings, ui
  pages/        route screens
```

**Supabase later:** all business logic is in pure functions (`lib/stats.ts`) over `{goals, completions}`, and persistence is isolated in the store's `persist` storage (`lib/storage.ts`). Replace that adapter / add async actions in the store; UI components don't touch storage.

## Assumptions

- Only the dark theme and English are available (shown as read-only rows).
- Seed demo data is generated relative to today on first launch; "Clear All Data" empties everything, "Load Demo Data" restores it.
- Goal color is intentionally not offered (palette is restricted to lime); an icon picker is provided.
- Future days can be planned but not checked off.
- The avatar uses initials (no proprietary imagery). The food image is a locally generated asset in `public/images`.
- Notifications/reminders are stored as preferences only; no push scheduling yet.
