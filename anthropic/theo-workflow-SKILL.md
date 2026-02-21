---
name: theo-workflow
description: Theo Armour's coding workflow and preferences. Use this skill whenever working on code with Theo, creating files, or starting new projects. Covers coding style, environment, tools, and communication preferences.
---

# Theo Workflow

## Environment

- **Hosting**: GitHub Pages (static only)
- **Editor**: VSCode
- **AI tools**: GitHub Copilot with Claude (GUI), Claude Code (CLI) for heavy lifting
- **Version control**: VSCode Source Control + GitLens, commit often with short messages

## Code Style

- Vanilla HTML, CSS, JavaScript only—no frameworks, no build tools
- Single-file preferred (HTML with embedded CSS/JS) unless too long
- ES6 features (arrow functions, let/const, template literals)
- Functional style: avoid classes, objects with methods, and `this`
- Meaningful variable names that explain themselves
- Minimal error checking—assume things work
- Beginner-readable: if a student can't follow it, simplify
- 3-letter namespaces for JS modules (e.g., `FGA` for Files GitHub API)
- Inline comments for clarity: brief, action-oriented (// Change message, // Create sparkles)

## Project Structure

- Sandbox repo for experiments: theo-armour.github.io/sandbox/
- Year-based repos for ongoing work (2024, 2025, etc.)
- TooToo as static CMS framework for browsing GitHub repos
- Each project folder gets its own README
- Related files stay together (html + README in same folder)

## Common Tools

- Three.js for 3D graphics
- GitHub API for repo browsing
- Showdown for Markdown-to-HTML conversion

## Communication

- Be concise
- Just try things—don't over-ask for clarification
- Explain in detail only when asked

## Documentation Practices

- Include changelog in READMEs (dated entries with version numbers)
- Document: features, how to use, tech stack, possible enhancements
- Add status indicators (✅ Complete, 🚧 In Progress, etc.)

## Iterative Development

- Make it work first, refine based on feedback
- Small incremental changes—don't rebuild, adjust
- Test immediately after each change

## UI/UX Details

- CSS animations for polish (fadeIn, transitions, hover states)
- Visual feedback for interactions (button pulse, scale)
- Emoji usage is fine for fun/friendly interfaces

## Context Handling

- Small projects: read files fresh each session
- Larger projects: keep a README with status and next steps
- Save key chat transcripts for decision history when useful
