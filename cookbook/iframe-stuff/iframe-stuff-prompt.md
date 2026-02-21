# Iframe Stuff Prompt

* In this folder, create a file named iframe-stuff.html. This file is used to display four iframes.
* Text font is monospace.
* For testing purposes, each of the iframes links to https://en.wikipedia.org, https://www.openstreetmap.org/export/embed.html, https://archive.org, and https://www.gutenberg.org.
* The iframes will be displayed in two columns. The left column has three rows; the right column has a single iframe. The default column widths are 20% left and 80% right.
* The user can resize the iframes by dragging the borders between them. The two-column layout and the three-row split in the left column should both be adjustable, while maintaining the overall full-viewport layout.
* The splitters should work with both mouse and touch input.
* Each panel has a minimum size so it cannot be collapsed to zero.
* The current splitter positions and custom iframe URLs are saved to localStorage and restored when the page is reloaded.
* A "Settings" button opens a modal (closeable via Escape, Cancel, or clicking the backdrop) where the user can:
  * Change the URL for each iframe. Each has a dropdown of 12 suggested websites (all confirmed to allow iframe embedding) and an editable text input below it. The dropdown defaults to "Other..." and the text input shows the current URL. Selecting a suggested site fills the input; the text input is always the source of truth for Apply.
  * Reset the layout, modal, and URLs to their defaults.
* The default and suggested URL lists are defined at the top of the script for easy editing.
