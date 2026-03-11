---
name: fix-bug
description: "Debug and fix issues in the task manager application. Use when: something is broken, tasks aren't saving, UI is not rendering correctly, or an error appears in the console."
---

# Fix Bug

Debug and fix an issue in the task manager application.

## Bug: {{bug_description}}

### Debugging Steps
1. Identify which file(s) are likely involved (`app.js`, `style.css`, or `index.html`)
2. Check the browser console for JavaScript errors
3. Verify localStorage data integrity — run `JSON.parse(localStorage.getItem('task-manager-tasks'))` in the console
4. Check if the issue is filter-state dependent (all/active/completed)
5. Test on both desktop and mobile viewport sizes

### Fix Requirements
- Do not introduce external dependencies
- Maintain backwards compatibility with existing stored tasks
- Ensure the fix doesn't break accessibility (ARIA, keyboard nav)
- Keep functions small and single-purpose
