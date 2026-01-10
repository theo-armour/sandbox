# Notesy: GitHub-Integrated Text Editor

## Overview
Browser-based text editor that reads/writes files directly to GitHub repositories. Single HTML file, no backend, no build process. Multiple instances can run simultaneously.

## Core Features

### GitHub Integration
- Use GitHub API with personal access tokens (stored in localStorage)
- Fetch and save files from any accessible repository (public or private)
- Use `location.hash` for file navigation—when hash changes, load that file
- Auto-commit changes with generated commit messages
- Handle base64 encoding/decoding and SHA hashes for version control

### File Management
- Hash-based navigation: `#filename.md` loads that file
- Quick access buttons for common files
- Display file metadata (size, last modified)

### Auto-Save
- Save automatically every 15 seconds when content changes
- Save on blur (when user clicks away)
- Throttle to prevent excessive API calls
- Skip saves when content unchanged

### User Interface
- Monospace font throughout
- Fixed header with save button and status
- Main content area: `contenteditable` or `textarea` div
- Visual feedback for save states (loading/success/error)
- Responsive, mobile-friendly
- Simple color scheme (dark blue headers, maroon h3)
- Max-width container for readability

### Smart Link Handling
- HTML → Markdown: if link text equals URL, output plain URL only
- Markdown → HTML: if text equals URL, leave as plain text
- Preserve complex URLs and special characters

## Technical Specs

### Stack
- **Single HTML file** with embedded CSS and JavaScript
- **Vanilla JavaScript** (ES6+, no frameworks)
- **Global namespace**: `XGP` object for config and state
- **GitHub API**: Contents API for file operations
- **Communication**: XMLHttpRequest

### HTML Structure
```
<!DOCTYPE html>
- viewport meta tag
- inline CSS
- fixed header (GitHub logo, nav, save button)
- main content area (contenteditable/textarea)
- control buttons
```

### Key Behaviors
- Event-driven architecture
- Track editing state (text/Markdown mode)
- Monitor content changes for auto-save
- Handle API rate limits across multiple instances

### Security
- GitHub token in localStorage only
- Validate user inputs
- Handle HTML injection safely
- No server dependencies

## User Flow
1. Provide GitHub personal access token
2. Navigate to file via URL hash or buttons
3. Edit content (auto-saves every 15s)
4. Visual feedback on save status

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
Use these files from https://github.com/pushme-pullyou/assets/tree/main/test-cases:

**Markdown files:**
- `markdown.md` - Standard markdown syntax
- `markdown-help.md` - Comprehensive markdown examples
- `sample.md` - General sample content

**Text files:**
- `text.txt` - Plain text baseline
- `file-names.txt` - Special characters in filenames
- `snippets.txt` - Code snippets, mixed content

**HTML/Security:**
- `style-sample.html` - HTML with various links
- `text-to-hack` files - HTML injection prevention tests

**Edge cases:**
- `us-county-state-latlon-pop.csv` - Large file performance test
- `ca_cs.xls` - Binary file handling
- `Photo Album_Example Auckland.pdf` - Non-text file handling

### Testing Workflow
1. **Basic**: Load `text.txt`, edit, save, reload
2. **Markdown**: Test link handling with `markdown.md` and `markdown-help.md`
3. **Multiple instances**: Open same file in 2+ tabs, edit simultaneously
4. **Auto-save**: Type, wait 15s; type and blur; verify throttling
5. **Hash navigation**: Change hash, use buttons, test browser back/forward
6. **Security**: Load `text-to-hack` files, verify safe HTML handling
7. **Performance**: Load large CSV, verify responsiveness
8. **Error cases**: Invalid hash, no permissions, rate limits
