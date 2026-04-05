# Sandbox Repository Instructions

Personal sandbox for experiments, prototypes, and AI tool exploration.
Hosted on GitHub Pages at theo-armour.github.io/sandbox/

## For AI Assistants

- **Read the code** to learn conventions — don't rely solely on this file
- Match the style of nearby files when making changes
- Vanilla JS, no frameworks, no build tools — that's the one hard rule
- Everything else: infer from context

## What I'm Working On

- **TooToo** — Single-file HTML GitHub repo browser using GitHub REST API + built-in markdown renderer
- **Prompt engineering** — Testing workflows across Claude, Copilot, Gemini, ChatGPT
- **Small tools** — Single-file HTML apps for personal use
- Check `0-sandbox-agenda.md` for current priorities

## Multi-Repo Context

TooToo is a single-file `index.html` with an inline `CONFIG` object (owner, repo, branch, localRepo).

Each copy differs only in its CONFIG values. Apply fixes to all three files.

## Hard Constraints

- Static hosting only — GitHub Pages, no backend
- Vanilla HTML5, CSS3, JavaScript (ES2020+)
- No frameworks, no build tools, no Node.js
- Must work by opening HTML files locally
- This is a playground — experimentation is encouraged

## Style Notes (brief — read the code for details)

- Functional style: avoid classes, `this`, `var`
- `const` over `let`
- Single-file HTML preferred unless it gets too long
- Beginner-readable: if a student can't follow it, simplify

## Development Workflow

- Make it work first, refine based on feedback
- Small incremental changes — don't rebuild, adjust
- Check `0-sandbox-agenda.md` for current priorities
- Keep changelogs in READMEs with dated entries

---

**Last Updated**: 2026-03-31
