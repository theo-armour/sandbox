---
applyTo: "**/*.js"
description: "JavaScript coding standards for the task manager. Use when: writing or modifying JavaScript files."
---

# JavaScript Instructions

- Use `const` for variables that won't be reassigned, `let` otherwise. Never use `var`.
- Use arrow functions for callbacks and anonymous functions.
- Use template literals (backticks) for string concatenation and HTML building.
- Use `document.querySelector` / `querySelectorAll` for DOM access.
- Use event delegation on container elements rather than individual listeners.
- Always sanitize user input before inserting into the DOM (escape HTML entities).
- Store data in localStorage as JSON. Always wrap `JSON.parse` in try/catch.
- Use `crypto.randomUUID()` for generating unique task IDs.
- Keep functions under 20 lines when possible. Each function should do one thing.
- Use descriptive names: `addTask`, `deleteTask`, `toggleTask`, `render`.
