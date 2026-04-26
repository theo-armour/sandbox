# Dashboard ~ iframe widgets

An alternative scaffold for the personal dashboard where each widget is an
independent HTML file embedded as an iframe.

## Why this pattern

* Each widget is fully isolated — its own DOM, CSS, scripts, and storage
* Adding or removing a widget is a one-line change in `index.html`
* A broken widget does not break the rest of the dashboard
* Each widget can be opened directly and tested on its own

## Files

| File | Role |
|---|---|
| `index.html` | Shell page. Renders a grid of iframes from a `WIDGETS` array. |
| `widget-base.css` | Shared styles used by every small widget for a consistent look. Each widget `<link>`s to this file directly. |
| `teodoro.html` | Teodoro activity timer. First tile (top left). Self-contained, brings its own styles. |
| `widget-clock.html` | Clock and date. |
| `widget-github.html` | Status monitor for ChatGPT, Claude, and Gemini. |
| `widget-weather.html` | Current conditions via Open-Meteo. |
| `widget-calendar.html` | Embedded Google Calendar in agenda mode. |
| `widget-links.html` | Quick links. |
| `widget-today.html` | News headlines from a list of RSS feeds. |
| `widget-notes.html` | Notes with `localStorage` persistence. |

## Adding a widget

1. Create `widget-myname.html` in this folder.
2. Link to `widget-base.css` for consistent styling.
3. Add an entry to the `WIDGETS` array in `index.html`:

```js
{ id: "myname", src: "widget-myname.html", height: 200, label: "My widget name", wide: false }
```

## Notes

* No build tools, no frameworks, no Node.js
* Works on GitHub Pages and via `file://`
* Cross-widget messaging would use `window.postMessage` if needed later
* Each widget should use its own `localStorage` key to avoid collisions
