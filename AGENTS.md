# Sandbox — AI Agent Instructions

## Hard Constraints

- **Vanilla JavaScript only** — no frameworks, no jQuery, no build tools, no Node.js
- **Single-file HTML preferred** — HTML + CSS + JS inline in one `.html` file
- **Static hosting** — GitHub Pages or `file://` only, no backend
- **ES2020+** — `const` over `let`, arrow functions, template literals, async/await, no `var`, no classes, no `this`

## What This Repo Is

A personal playground for prompt engineering and small single-file HTML tools.
Hosted at `theo-armour.github.io/sandbox/`.

- AI provider experiments live in `anthropic/`, `chatgpt/`, `gemini/`, `copilot/`, `perplexity/`
- Reusable prompts in `prompts/`, task scripts in `tasks/`, starter files in `templates/`
- Small apps go in `0-apps/`
- `index.html` is a TooToo instance that browses this repo

## Karpathy's Rules for Writing Code

1. Don't assume. Don't hide confusion. Surface tradeoffs.
2. Minimum code that solves the problem. Nothing speculative.
3. Touch only what you must. Clean up only your own mess.
4. Where it makes sense, define success criteria and verify before moving on.

## Development Workflow

- Experimentation is encouraged — rough edges are fine
- Check `0-sandbox-agenda.md` for current priorities
- Notes go in `0-sandbox-journal.md`
- Each experiment is typically self-contained; prefer adding new files over editing old ones
