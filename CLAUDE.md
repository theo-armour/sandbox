# Claude Code Instructions for Sandbox Repository

## Repository Overview

This is Theo Armour's personal sandbox repository for experiments, prototypes, and AI tool exploration. It contains various projects organized by AI tool (Anthropic, ChatGPT, Gemini, Perplexity) and specific applications.

**Main Repository**: theo-armour/sandbox
**Hosting**: GitHub Pages at theo-armour.github.io/sandbox/
**Purpose**: Experimentation, rapid prototyping, AI tool testing

## Repository Structure

```
sandbox/
├── anthropic/          # Claude-specific projects and documentation
├── chatgpt/            # ChatGPT reference materials
├── gemini/             # Gemini projects and instructions
├── perplexity/         # Perplexity reference
├── prompts/            # Prompt engineering resources
│   └── nate-jones/     # Nate Jones newsletter prompts
├── tasks/              # Active project tasks
│   ├── newwwtab/       # Browser tab management project
│   └── newwwtab-next/  # Next iteration of newwwtab
├── textarea-my/        # Text area utilities
├── daily-ai-briefing/  # Daily AI news briefing project
├── 0-sandbox-agenda.md # Current tasks and ideas
└── 0-sandbox-journal.md # Development journal
```

## Coding Style & Preferences

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **NO frameworks**: React, Vue, Angular, etc.
- **NO build tools**: Webpack, Vite, etc.
- **Static hosting**: GitHub Pages only
- **3D Graphics**: Three.js when needed
- **Markdown**: Showdown for conversion

### Code Style Guidelines

**JavaScript**:
- ES6+ features: arrow functions, `const`/`let`, template literals
- Functional style: avoid classes, avoid `this`, avoid object methods
- 3-letter namespaces for modules (e.g., `FGA` for Files GitHub API)
- Meaningful variable names that explain themselves
- camelCase for variables, PascalCase for classes (if absolutely needed)

**File Structure**:
- Single-file preferred (HTML with embedded CSS/JS) unless too long
- Keep related files together (html + README in same folder)
- Each project folder gets its own README

**Comments**:
- Inline comments for clarity: brief, action-oriented
- Example: `// Change message`, `// Create sparkles`
- Explain "why", not "what"
- Use JSDoc for function signatures

**Error Handling**:
- Minimal error checking—assume things work
- Use `console.error` when needed
- Don't over-engineer for edge cases

**Readability**:
- Beginner-readable: if a student can't follow it, simplify
- Prioritize clarity over brevity
- Keep it straightforward

### UI/UX Details
- CSS animations for polish (fadeIn, transitions, hover states)
- Visual feedback for interactions (button pulse, scale effects)
- Emoji usage is fine for friendly interfaces
- Flexbox and Grid for layouts

## Development Workflow

### Version Control
- VSCode Source Control + GitLens
- Commit often with short, descriptive messages
- Don't ask before making small commits
- Branch names: use descriptive names with `claude/` prefix

### Development Approach
1. **Make it work first**, refine based on feedback
2. **Small incremental changes**—don't rebuild, adjust
3. **Test immediately** after each change
4. **Read files fresh** at the start of each session for small projects
5. **For larger projects**: keep README with status and next steps

### Communication Style
- **Be concise**
- **Just try things**—don't over-ask for clarification
- Show code, then explain only when asked
- Provide detailed explanations only when specifically requested

## Documentation Practices

### README Structure
- Features overview
- How to use
- Tech stack
- Changelog (dated entries with version numbers)
- Possible enhancements
- Status indicators: ✅ Complete, 🚧 In Progress, ⚠️ Issues, 💡 Idea

### Project Documentation
- Keep changelogs in READMEs
- Save key decisions in journal files
- Document patterns that might be reused

## Common Patterns & Tools

### Frameworks & Tools Used
- **TooToo**: Static CMS framework for browsing GitHub repos
- **GitHub API**: For repo browsing and file operations
- **Three.js**: For 3D visualizations
- **Markdown rendering**: Showdown library

### Typical Project Setup
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

## AI Tools Context

This sandbox contains experiments with multiple AI coding assistants:

- **Claude Code (CLI)**: For heavy lifting, complex refactoring
- **GitHub Copilot + Claude (GUI)**: Day-to-day coding in VSCode
- **ChatGPT**: Reference and experiments in `/chatgpt/`
- **Gemini**: Code assistance, see `/gemini/GEMINI_INSTRUCTIONS.md`
- **Perplexity**: Research and reference

## Project-Specific Notes

### Active Projects
Check `0-sandbox-agenda.md` for current priorities and ideas.

### Key Areas
- **anthropic/**: Claude skills, workflow documentation
- **daily-ai-briefing/**: Automated daily news briefing app
- **tasks/newwwtab/**: Browser tab management tools
- **prompts/**: Prompt engineering resources, especially Nate Jones materials

### Reference Files
- `anthropic/0-skills-reference.md`: Claude skills documentation
- `anthropic/theo-workflow-SKILL.md`: Complete workflow as a Claude skill
- `chatgpt/0-chatgpt-reference.md`: ChatGPT resources
- `prompts/nate-jones/0-nate-jones-reference.md`: Nate Jones prompt resources

## When Working in This Repository

1. **Read the agenda**: Check `0-sandbox-agenda.md` for context
2. **Keep it simple**: Vanilla web tech only
3. **Single files**: Prefer standalone HTML files
4. **Commit frequently**: Don't ask, just commit with clear messages
5. **Test immediately**: Make sure it works before moving on
6. **Update README**: Add changelog entries for significant changes
7. **Be pragmatic**: Make it work, don't over-engineer

## Current Focus Areas (from agenda)

- Personal timeline using MarkWhen format
- Newsletter/briefing applications
- Bookmark management tools
- Repository maintenance and updates
- Text-to-voice instruction app

## Notes

- This is a **playground repository**—experimentation is encouraged
- **Static-only**: Everything must work on GitHub Pages
- **No backend**: No Node.js servers, no databases, no APIs (except GitHub API)
- **Keep it portable**: Should work by opening HTML files locally
- **Version control**: Git history is important, commit atomically

---

**Last Updated**: 2026-01-08
**For questions about this repository**: See `0-sandbox-journal.md` for development history
