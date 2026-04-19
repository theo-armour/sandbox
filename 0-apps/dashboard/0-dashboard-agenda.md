# Dashboard Agenda

## 2026-04-18

* First version
## Ideas

Here are ideas to consider, grouped by how useful they tend to be at-a-glance in a small iframe pane:

## Time & Place
* **Clock** (you have it) — add seconds optionally, plus a second timezone for family/collaborators
* **Sun** — sunrise/sunset, daylight remaining, golden hour
* **Moon** — phase + illumination %
* **Weather** (you have it) — current temp, today's high/low, precipitation chance, wind
* **Air quality** (AQI) — useful in SF
* **Tide / fog** — SF-specific novelties

## Personal Status
* **On this day** — birthdays, anniversaries, historical events from your own files
* **Day counter** — days lived, days into the year, days until X
* **Pomodoro / activity indicator** — receives `postMessage` from Teodoro sibling iframe
* **Water / steps / habit ticks** — simple tally buttons stored in `localStorage`

## Work & Focus
* **Today's top 3** — editable, persisted
* **Quick Links** (you have it) — group by category (dev, writing, admin)
* **Recent files / repos** — hand-curated list of current projects
* **GitHub activity** — latest commit across your repos (fetch from GitHub API, no auth needed for public)
* **Open PRs / issues assigned** — if you want to sign in

## Thinking & Inputs
* **Notes / scratchpad** (you have it) — consider a daily-rolling note keyed by date
* **Quote of the day** — from a local JSON array
* **Word / term of the day**
* **Random prompt** — writing prompt, question, or card draw
* **RSS headline** — one line from a feed you care about

## Ambient / Reference
* **Stock / crypto ticker** — a few symbols
* **Currency** — USD ↔ EUR/GBP
* **Unit cheatsheet** — quick converter
* **Countdown** — to next trip, deadline, or birthday

## Plumbing worth building early
* **Config block** at top: `const PANELS = [...]` so you can reorder/toggle sections without touching markup
* **Per-section collapse** with state in `localStorage`
* **`postMessage` bus** spec — define message shape now (`{ source, type, payload }`) so Teodoro, calendar, and dashboard can talk later
* **Refresh cadence** — per section (clock 1 min, weather 15 min, GitHub 5 min)

Want me to update dashboard-prompt.md with a curated subset, or sketch any of these into dashboard.html?
