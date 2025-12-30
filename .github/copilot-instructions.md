# Copilot Instructions for Theo Armour Workspace

## Workspace Overview
This is a multi-repository workspace containing 8 interrelated projects focused on personal knowledge management, web development experimentation, and genealogy research. All repos follow similar architectural patterns and share common utilities.

## Architecture & Shared Patterns

### Markdown-Centric Ecosystem
- **Primary Format**: GitHub Flavored Markdown (`.md`) for all content
- **Browser Viewers**: `readme.html` and `index.html` files render Markdown in-browser using JavaScript libraries (Showdown, Marked, Markdown-it)
- **PDF Generation**: Uses VS Code's `markdown-pdf` extension with custom styling via `markdown-pdf.css`
- **TooToo CMS**: Custom lightweight content management system found in various repos under `tootoo/` folders for viewing/editing Markdown files

### File Organization Conventions
- **Numbered Prefixes**: Files and folders use `0-`, `1-`, `2-` etc. to enforce sort order and indicate importance/workflow
- **Date Prefixes**: Use `YYYY-MM-DD` format for dated entries (journals, blog posts)
- **Ontology-Based**: Categories align with `1-agenda-ontology.md` (found in theo-armour-agenda)
- **Pinning**: Use `% %` markers to make items easily searchable (e.g., `% % Important Item`)

### Linking Strategies
- **Cross-Repo Links**: Use absolute `file:///` paths for linking between repos in the workspace
  - Example: `file:///C:/Users/tarmo/OneDrive/Documents/GitHub/theo-armour-pages/...`
- **Intra-Repo Links**: Use relative paths within a single repository
- **All repos live under**: `g:\My Drive\2026-theo-github\`

## Repository Purposes

### theo-armour-sandbox (Current)
**Purpose**: AI experimentation, prompt engineering, and prototyping new web apps
- `anthropic/`: Claude/Anthropic-specific experiments, workflow files, and skills
- `chatgpt/`, `gemini/`, `perplexity/`: Platform-specific AI testing
- `prompts/`: Reusable prompt templates and prompt engineering techniques
- `tasks/`: Browser extension prototypes (newwwtab)
- **Pattern**: Single-file HTML apps with embedded CSS/JS (no build process)

### theo-armour-agenda
**Purpose**: Personal task management and journaling
- `0-agenda.md`: Central scratchpad/daily agenda
- `1-agenda-ontology.md`: Defines the categorization scheme used across all repos
- Actions categorized as: "To be taken", "Taken" (journaling), "Reference"
- Heavy use of PDF generation for archiving

### theo-armour-pages
**Purpose**: Digital commonplace book - curated knowledge base organized by Wikipedia-style categories
- Follows Wikipedia category structure (e.g., `03-geography-places`, `13-technology-applied-sciences`)
- Content migrated from Evernote, Google Drive, various platforms
- Raindrop.io bookmarks integrated

### theo-armour-qdata
**Purpose**: Private/personal apps, journals, code experiments
- `apps/`: Custom web applications (Notesy, Teodori, Trayo, etc.)
- `journal/`: Personal diary entries
- **Notesy**: GitHub-integrated Markdown editor with bidirectional HTML↔Markdown conversion

### heritage-happenings.github.io
**Purpose**: Blog/newsletter for Heritage on the Marina (residential community)
- Blog posts in `Blog/YYYY/` folders
- Dining service menus and schedules
- Community announcements

### theo-armour-2025
**Purpose**: Current year's personal website and blog
- Social media links aggregation
- Blog content in `blog/` folder

### theo-armour-genealogy
**Purpose**: Family history research and genealogy data
- GEDCOM file processing
- API integrations: FamilySearch, Geni
- Individual profiles in `profiles/`

### theo-armour-wikitheo
**Purpose**: Personal knowledge management system development notes
- PKM (Personal Knowledge Management) experimentation
- Bookmark management tools

## Technical Patterns

### Self-Contained HTML Files
Most web apps follow this pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Inline CSS in <style> tags -->
</head>
<body>
  <!-- Content -->
  <script>
    // Vanilla JavaScript, no build tools
    // ES6 features (arrow functions, const/let, template literals)
  </script>
</body>
</html>
```

### Markdown↔HTML Conversion
- **Libraries Used**: Showdown.js, Marked.js, Markdown-it, Turndown.js
- **Custom Preservation**: Always preserve `<details>`, `<summary>`, `<img>`, `<video>` tags during conversion
- **Regex-Based**: Many conversions use custom regex instead of libraries for precise control

### GitHub Integration
Several apps use GitHub API for file management:
- Personal access tokens stored in `localStorage`
- Direct file editing via GitHub API
- Auto-save functionality
- Pattern found in: Notesy app, TooToo viewers

## Development Workflows

### Creating New HTML Apps
1. Single `.html` file with embedded CSS and JavaScript
2. No build process or dependencies
3. Use vanilla JavaScript (ES6+)
4. Test by opening directly in browser
5. Common pattern: Interactive demos, utilities, experiments

### PDF Generation from Markdown
1. Edit Markdown file in VS Code
2. Use `markdown-pdf` extension (yzane.markdown-pdf)
3. Styling controlled by `markdown-pdf.css` in repo root
4. Settings in `.vscode/settings.json`:
   - Headers: Usually filename
   - Footer: Page numbers
   - Format: Letter size

### Working with Journals
- Daily entries in `0-*-journal.md` files
- Use date headers: `## YYYY-MM-DD`
- Three categories: To be taken, Taken, Reference
- Pin important items with `% %`

### Cross-Repo References
When referencing or linking to files in other repos:
- Use absolute paths starting with `file:///C:\Users\tarmo\`
- Common refs: `theo-armour-pages` for knowledge, `theo-armour-qdata` for apps
- Structure: `file:///C:\Users\tarmo\OneDrive\Documents\GitHub\[repo-name]\...`

## Key Dependencies

### VS Code Extensions
- **markdown-pdf** (yzane.markdown-pdf): Critical for PDF workflow
- **Local History**: Tracks file versions (vscode-local-history scheme in URIs)

### JavaScript Libraries (CDN-loaded)
- Showdown.js: Markdown parsing
- Marked.js: Alternative Markdown parser
- Turndown.js: HTML to Markdown conversion
- Markdown-it: Modern Markdown parser with plugins

### External Services
- GitHub API: File storage, version control
- Raindrop.io: Bookmark management

## Common Tasks

### Adding a New Experiment
- Create folder under `anthropic/`, `chatgpt/`, or `gemini/` based on AI tool used
- Add README.md explaining the experiment
- Include working code files
- Reference any prompts used in `prompts/` folder

### Creating Browser Extension
- Use `tasks/newwwtab/` as template
- Includes `manifest.json` and `index.html`
- Single-page design, no backend

### Updating Ontology
- Edit `theo-armour-agenda/1-agenda-ontology.md`
- Categories: 0-Admin, 1-Health, 2-People, 3-Organizations, 4-Tech
- Update folder structure across repos to match

## Special Considerations

- **No Node.js**: Most apps avoid Node/npm; prefer CDN libraries or vanilla JS
- **Mobile Testing**: Author tests on Chromebook, Samsung tablet
- **Version Control**: Uses Git but also relies on VS Code Local History
- **AI Tools**: Heavy use of Claude, ChatGPT, Gemini - documents which tool generated what
- **Personal Use**: Code optimized for author's workflow, not general consumption
