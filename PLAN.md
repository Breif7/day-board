# Day Board — Plan

> One page with your calendar, your email, and your to-dos. It refreshes every morning and gives you a summary of what's coming.

## Goal
A single "today" dashboard that pulls Google Calendar events, recent important emails, and pending tasks into one view, plus an AI-written morning brief.

## Core features (MVP)
1. **Stat cards** — events today, new emails, pending tasks, important tasks.
2. **Month calendar + today's list** — mini calendar with today highlighted, list of today's events.
3. **Today's agenda timeline** — hourly timeline with event cards and check-off circles; "New event" button.
4. **Recent emails** — last N unread/important Gmail threads (sender, subject, snippet, time).
5. **Today's to-dos** — tasks with category tag and star (important) toggle.
6. **Morning brief** — scheduled job at ~6:30 local time builds a short summary (Claude) of the day: meetings, deadlines, emails needing reply.
7. **Global search** across events, emails, and tasks.

## Later
- Notes, Habits, Projects sections (sidebar items in the mockup).
- Push/email delivery of the morning brief.
- Microsoft 365 / Outlook support.

## Stack
| Layer | Choice |
|---|---|
| App | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui |
| Auth | Google OAuth (scopes: `calendar.readonly`, `gmail.readonly`) via Auth.js |
| DB | Supabase Postgres (tasks, cached brief, user settings) |
| AI | Claude API (`claude-haiku-5-5` for the brief) |
| Jobs | Vercel Cron → `/api/cron/morning-brief` |
| Hosting | Vercel |

## Data model
- `users(id, email, timezone, brief_time)`
- `tasks(id, user_id, title, category, priority, starred, due_date, done_at)`
- `briefs(id, user_id, date, content_md, created_at)`
- Calendar & email are fetched live from Google (short cache), not stored.

## Milestones
1. **Setup** — Next.js scaffold, Tailwind theme (soft pink palette), layout + sidebar.
2. **Auth + Google** — OAuth, calendar list today/month, Gmail recent threads.
3. **Tasks** — CRUD, star, categories, today filter.
4. **Dashboard** — stat cards, mini calendar, agenda timeline, emails, tasks widgets.
5. **Morning brief** — cron job + Claude prompt + brief card on dashboard.
6. **Polish** — search, empty states, mobile layout, deploy.

## Risks
- Gmail restricted scopes need Google verification for public use → keep app in "testing" mode (personal use) initially.
- Timezone handling for cron — store user timezone and run hourly, firing per-user at their local time.
