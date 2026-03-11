# Task Manager

A simple task manager web application built with vanilla JavaScript, plain CSS, and localStorage.

## Features

- Add, delete, and mark tasks as completed
- Filter tasks by All / Active / Completed
- Task count display
- Clear all completed tasks
- Data persists in localStorage
- Responsive design (mobile-friendly)
- Accessible (ARIA attributes, keyboard navigation)

## Getting Started

No build step required. Open `index.html` directly in your browser:

1. Clone or download the project
2. Open `index.html` in any modern browser
3. Start adding tasks

## Tech Stack

- **HTML5** — Semantic elements with ARIA attributes
- **CSS3** — Custom properties, flexbox, BEM naming, mobile-first
- **JavaScript** — Vanilla ES6+, no frameworks or dependencies
- **Storage** — localStorage (JSON)

## Project Structure

```
sample-app/
├── index.html              # Main HTML page
├── style.css               # All styles
├── app.js                  # Application logic
├── README.md               # This file
└── .github/
    ├── copilot-instructions.md      # Workspace-wide Copilot instructions
    ├── agents/
    │   ├── code-reviewer.agent.md   # Code review agent
    │   └── designer.agent.md        # UI/UX design agent
    ├── instructions/
    │   ├── js.instructions.md       # JavaScript coding standards
    │   └── css.instructions.md      # CSS coding standards
    └── prompts/
        ├── add-feature.prompt.md    # Template for adding features
        └── fix-bug.prompt.md        # Template for debugging
```

## Copilot Customization

This project includes GitHub Copilot customization files:

- **Workspace instructions** (`.github/copilot-instructions.md`): Always-on coding conventions
- **Custom agents**: `@code-reviewer` for reviews, `@designer` for UI/UX help
- **Prompts**: `/add-feature` and `/fix-bug` templates
- **File instructions**: Auto-applied when editing `.js` or `.css` files
