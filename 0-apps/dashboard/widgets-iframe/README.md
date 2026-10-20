# Dashboard ~ iframe widgets

An alternative scaffold for the personal dashboard where each widget is an
independent HTML file embedded as an iframe.

## Why this pattern

* Each widget has its own DOM, CSS, and scripts; same-origin storage is shared by key
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
| `widget-reminders.html` | Time-of-day reminders displayed from separate text files in an iframe. |
| `widget-github.html` | Status monitor for ChatGPT, Claude, Gemini, and GitHub. |
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

## Reminders

The reminders widget replaces Quick links in the dashboard and spans two columns
on wider screens (one column on small screens). It uses the device's local time. Edit the corresponding file
in [reminders/](reminders/) to change a message:

| Time period | Local time | Message file |
|---|---|---|
| Overnight | Midnight - 9 am | [overnight-00-09.txt](reminders/overnight-00-09.txt) |
| Early morning | 9 am - 11 am | [early-morning-09-11.txt](reminders/early-morning-09-11.txt) |
| Late morning | 11 am - 1 pm | [late-morning-11-13.txt](reminders/late-morning-11-13.txt) |
| Early afternoon | 1 pm - 4 pm | [early-afternoon-13-16.txt](reminders/early-afternoon-13-16.txt) |
| Late afternoon | 4 pm - 6 pm | [late-afternoon-16-18.txt](reminders/late-afternoon-16-18.txt) |
| Early evening | 6 pm - 10 pm | [early-evening-18-22.txt](reminders/early-evening-18-22.txt) |
| Late evening | 10 pm - midnight | [late-evening-22-24.txt](reminders/late-evening-22-24.txt) |

Filenames include the start and end hours in 24-hour notation.

Each period starts at its listed start time and ends when the next period starts.
The widget checks the time every second and when the page becomes visible again.
It navigates the iframe only when the period changes or you click **Reload**.
Click Reload after editing the current message.

Messages are UTF-8 plain-text files, displayed by the browser in an iframe.
Line breaks are preserved; Markdown formatting is not rendered. The iframe
scrolls when needed and uses the browser's text-file presentation on a white
background. The period name above it links directly to the text file.

The same relative paths work on GitHub Pages, a local server, and directly from
disk (`file://`), without a folder picker or external scripts. The widget does
not read the iframe's document, so it does not require cross-file script access.
If a file is missing, the browser handles the iframe navigation error; open the
period-name link to inspect it. Browsers do not reliably report iframe navigation
failures to the parent widget.
