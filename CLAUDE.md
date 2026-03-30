# Sandbox Repository Instructions

Personal sandbox for experiments, prototypes, and AI tool exploration.
Hosted on GitHub Pages at theo-armour.github.io/sandbox/

## Repository Structure

```
sandbox/
├── .github/            # Copilot instructions
├── anthropic/          # Claude projects and documentation
├── chatgpt/            # ChatGPT reference materials
├── cookbook/            # Code recipes and snippets
├── copilot/            # GitHub Copilot reference
├── gemini/             # Gemini projects and instructions
├── perplexity/         # Perplexity reference
├── prompts/            # Prompt engineering resources
├── tasks/              # Active projects (newwwtab, grid-paper)
├── templates/          # Reusable project templates
├── textarea-my/        # Text area utilities
├── tootoo/             # TooToo static CMS framework
├── 0-sandbox-agenda.md # Current tasks and ideas
└── 0-sandbox-journal.md # Development journal
```

## Technology Stack

- Vanilla HTML5, CSS3, JavaScript (ES2020+)
- No frameworks (no React, Vue, Angular, jQuery)
- No build tools (no Webpack, Vite, Node.js)
- Static hosting only—GitHub Pages
- Three.js for 3D graphics when needed
- Showdown for Markdown rendering

## Code Style

**JavaScript**:
- ES2020+ features: arrow functions, `const`/`let`, template literals, optional chaining (`?.`), nullish coalescing (`??`), async/await, dynamic imports
- Functional style: avoid classes, avoid `this`, avoid object methods
- `const` over `let`; never `var`
- camelCase for variables/functions
- 3-letter namespaces for modules (e.g., `FGA` for Files GitHub API)
- Meaningful, self-explanatory variable names
- ES modules (`import`/`export`)

**HTML/CSS**:
- HTML5 semantic elements
- CSS Grid, Flexbox, Custom Properties
- CSS animations for polish (fadeIn, transitions, hover states)

**File Structure**:
- Single-file preferred (HTML with embedded CSS/JS) unless too long
- Keep related files together (HTML + README in same folder)
- Each project folder gets its own README

**Comments**:
- Brief inline comments explaining "why", not "what"
- JSDoc for function signatures

**Error Handling**:
- Minimal—assume things work
- `console.error` when needed
- Don't over-engineer for edge cases

**Readability**:
- Beginner-readable: if a student can't follow it, simplify
- Clarity over brevity

## Typical Project Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Name</title>
    <style>
        /* Embedded CSS */
    </style>
</head>
<body>
    <!-- HTML content -->
    <script type="module">
        // JavaScript code
    </script>
</body>
</html>
```

## Development Workflow

- Make it work first, refine based on feedback
- Small incremental changes—don't rebuild, adjust
- Test immediately after each change
- Commit often with short, descriptive messages
- Check `0-sandbox-agenda.md` for current priorities

## Documentation

- Keep changelogs in READMEs with dated entries
- Status indicators: ✅ Complete, 🚧 In Progress, ⚠️ Issues, 💡 Idea
- Save key decisions in `0-sandbox-journal.md`

## Constraints

- Everything must work on GitHub Pages (static only)
- No backend, no databases, no server-side code
- Must work by opening HTML files locally
- This is a playground—experimentation is encouraged

---

**Last Updated**: 2026-03-29
