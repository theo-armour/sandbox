---
name: add-feature
description: "Add a new feature to the task manager application. Use when: implementing new functionality like due dates, categories, drag-and-drop, etc."
---

# Add Feature

Add a new feature to the task manager application.

## Feature: {{feature_name}}

### Requirements
- Describe the feature behavior in detail
- The feature must work with vanilla JavaScript (no frameworks)
- Data must persist in localStorage
- UI must be responsive and accessible

### Implementation Checklist
1. Update the task object schema in `app.js` if new data fields are needed
2. Add HTML elements in `index.html` with proper ARIA attributes
3. Add styles in `style.css` using CSS custom properties and BEM naming
4. Add event handlers using event delegation where possible
5. Ensure backwards compatibility with existing localStorage data
6. Test keyboard navigation for any new interactive elements
