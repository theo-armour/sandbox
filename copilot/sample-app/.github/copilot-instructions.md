# Task Manager - Copilot Instructions

## Project Overview
A task manager web application built with vanilla JavaScript, plain CSS, and localStorage for persistence.

## Tech Stack
- **HTML**: Semantic HTML5 elements
- **CSS**: Plain CSS with CSS custom properties (no preprocessors, no frameworks)
- **JavaScript**: Vanilla ES6+ (no frameworks, no build tools)
- **Storage**: localStorage for data persistence

## Coding Conventions

### HTML
- Use semantic elements (`<main>`, `<section>`, `<header>`, `<footer>`, `<button>`)
- Include ARIA attributes for accessibility
- All interactive elements must be keyboard accessible

### CSS
- Use CSS custom properties for theming (colors, spacing, fonts)
- Mobile-first responsive design
- Use BEM-like naming for clarity (e.g., `.task-item`, `.task-item--completed`)
- No `!important` unless absolutely necessary

### JavaScript
- Use `const` and `let` (never `var`)
- Use arrow functions for callbacks
- Use template literals for HTML string building
- All DOM queries should use `document.querySelector` / `querySelectorAll`
- Event delegation on the task list container
- Data stored in localStorage as JSON array of task objects
- Each task object: `{ id: string, text: string, completed: boolean, createdAt: string }`

### General
- No external dependencies or CDN links
- No build step required - open `index.html` directly in browser
- Keep functions small and single-purpose
- Use meaningful variable and function names
