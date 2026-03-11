---
applyTo: "**/*.css"
description: "CSS coding standards for the task manager. Use when: writing or modifying CSS files."
---

# CSS Instructions

- Define all theme values (colors, spacing, fonts, radii) as CSS custom properties in `:root`.
- Use BEM-like naming: `.block`, `.block__element`, `.block--modifier`.
- Write mobile-first styles. Add `min-width` media queries for larger screens.
- Use `flexbox` or `grid` for layout. Avoid floats and absolute positioning for layout.
- Use `rem` for font sizes and spacing values.
- Never use `!important` unless overriding third-party styles (which this project doesn't have).
- Ensure interactive elements have visible `:focus` styles for keyboard accessibility.
- Maintain sufficient color contrast (WCAG AA: 4.5:1 for normal text, 3:1 for large text).
- Use `transition` for hover/focus state changes (keep under 300ms).
- Group related styles: reset → layout → components → utilities → media queries.
