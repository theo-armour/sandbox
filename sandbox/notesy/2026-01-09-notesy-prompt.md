# Notesy: Dual-Mode Text Editor

## Overview
Browser-based text editor that works in two modes:
- **GitHub Mode**: Reads/writes files to GitHub repositories via API
- **Local Mode**: Reads/writes files from local filesystem

Single HTML file, no backend, no build process. Automatically detects environment and switches modes.

**Multi-Instance Support**: Multiple instances can run simultaneously in separate tabs, windows, or iframes. Each instance loads a single file independently.

## Core Features

### Mode Detection
- **GitHub Mode**: Detected when hostname is NOT `localhost`, `127.0.0.1`, or `file://`
- **Local Mode**: Detected when hostname IS `localhost`, `127.0.0.1`, or protocol is `file://`
- Mode detection happens automatically on page load

### GitHub Mode
- Use GitHub API with personal access tokens (stored in localStorage)
- Fetch and save files from any accessible repository (public or private)
- Auto-commit changes with generated commit messages
- Handle base64 encoding/decoding and SHA hashes for version control

### Local Mode
- Fetch files from same directory using relative URLs (`fetch('./filename.md')`)
- Save files using FileSystem Access API (writes directly back to original file)
- User grants permission once per session to write to files
- No GitHub API calls

### File Management (Both Modes)
- Hash-based navigation: `#filename.md` loads that file
- Quick access buttons for test files (README.md, test.md, test.txt)
- Display file metadata (size, last modified)
- Files are relative to HTML file location

### Auto-Save
- Save automatically every 15 seconds when content changes
- Save on blur (when user clicks away)
- Throttle to prevent excessive API calls
- Skip saves when content unchanged

### User Interface
- Monospace font throughout
- Fixed header with save button and status indicator
- Main content area: `contenteditable` or `textarea` div that adjusts to window size
- Visual feedback for save states (loading/success/error)
- Responsive, mobile-friendly layout
- Simple color scheme (dark blue header, minimal styling)
- Max-width: 30rem for readability

### Smart Link Handling
- Preserve complex URLs and special characters properly

## Technical Specs

### Stack
- **Single HTML file** with embedded CSS and JavaScript
- **Vanilla JavaScript** (ES6+, no frameworks)
- **Global namespace**: `XGP` object for config and state
- **GitHub API**: Contents API for file operations
- **Communication**: XMLHttpRequest

### HTML Structure
```html
<!DOCTYPE html>
<html>
  <head>
    - viewport meta tag
    - inline CSS
  </head>
  <body>
    - fixed header:
      - GitHub logo (links to current source of file being edited on GitHub)
      - currently edited file title
      - save status indicator
      - save button
    - main content area:
      - contenteditable/textarea div (resizes with window)
      - quick access buttons for test files
      - control buttons
  </body>
</html>
```

### Key Behaviors
- Event-driven architecture
- Automatic mode detection on page load
- Track editing state and content changes for auto-save
- Handle API rate limits across multiple instances (GitHub mode)
- Configuration defaults (GitHub user, repo, branch, test files) set in `XGP` object
- FileSystem Access API for local file writing (Local mode)

### Security
- GitHub token in localStorage only
- Validate user inputs
- Handle HTML injection safely
- No server dependencies

## User Flow

### GitHub Mode
1. Enter GitHub personal access token (one-time setup)
2. Navigate to file via URL hash (`#filename.md`) or quick access buttons
3. Edit content—auto-saves every 15 seconds or on blur to GitHub
4. Visual feedback shows save status (ready/loading/success/error)

### Local Mode
1. Navigate to file via URL hash (`#filename.md`) or quick access buttons
2. App fetches file from local directory
3. Edit content—auto-saves every 15 seconds or on blur
4. FileSystem Access API writes directly back to original file
5. Visual feedback shows save status (ready/loading/success/error)

## Error Handling
- Minimal—assume things work
- Graceful degradation if GitHub API unavailable
- Track rate limits when multiple instances run

## Performance
- Fast loading (minimal dependencies)
- Immediate visual feedback
- Intelligent caching to minimize API calls

## Testing

### Test Case Files
These files are all in the same folder as the app:
- README.md
- test.md
- test.txt

## Testing Workflow
1. **Basic**: Load `text.txt` → edit → save → reload → verify persistence
2. **Markdown**: Test link handling with `README.md` and `test.md`
3. **Multiple instances**: Open same file in 2+ tabs → edit simultaneously → verify last save wins
4. **Auto-save**: Type, wait 15s → verify auto-save; type and blur → verify immediate save; rapid edits → verify throttling
5. **Hash navigation**: Change hash in URL → verify file loads; use buttons → verify hash updates; browser back/forward → verify navigation
6. **Security**: Load `text-to-hack` files → verify safe HTML handling (no XSS)
7. **Performance**: Load `us-county-state-latlon-pop.csv` → verify responsiveness with large file
8. **Error cases**: Invalid hash → verify error message; no write permissions → verify error handling; rate limits → verify graceful degradation
