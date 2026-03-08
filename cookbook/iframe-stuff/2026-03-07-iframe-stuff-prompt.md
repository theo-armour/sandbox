# Iframe Stuff Prompt

* In this folder, create a file named iframe-stuff.html. This file is used to display four iframes.
* Text font is monospace.
* For testing purposes, each of the iframes links to:
- https://theo-armour.github.io/sandbox/cookbook/teodoro/
- https://theo-armour.github.io/sandbox/cookbook/iframe-stuff/iframe-director.html
- https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FLos_Angeles&mode=AGENDA&showTitle=0&showPrint=0&showTz=0&src=dC5hcm1vdXJAZ21haWwuY29t&src=Mmw4cGp1MXB2czc0Ym42ZHY3NWY0Y2JjZjhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=cnUyMXA3M2VkdDR2MHZqMXM2Zjc1aHRpMmtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ajIwNGYzMG1yczNmOTRwNGY5MmJkMjZjZnNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=Y3RtY2xzY2d1NTVxazZwZXA5ZG84bm1wNGdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZjBnOHM1ODNvcXF2ZG1zYnExbmJnMGhzZ2dAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%23616161&color=%23AD1457&color=%23F4511E&color=%23D50000&color=%230B8043&color=%23009688

* The iframes will be displayed in two columns. The left column has three rows; the right column has a single iframe. The default column widths are 20% left and 80% right.

* The user can resize the iframes by dragging the borders between them. The two-column layout and the three-row split in the left column should both be adjustable, while maintaining the overall full-viewport layout.
* The splitters should work with both mouse and touch input.
* Each panel has a minimum size so it cannot be collapsed to zero.

* The current splitter positions and custom iframe URLs are saved to localStorage and restored when the page is reloaded.
* A "Settings" button opens a modal (closeable via Escape, Cancel, or clicking the backdrop) where the user can:
  * Change the URL for each iframe. Each has a dropdown of 12 suggested websites (all confirmed to allow iframe embedding) and an editable text input below it. The dropdown defaults to "Other..." and the text input shows the current URL. Selecting a suggested site fills the input; the text input is always the source of truth for Apply.
  * Reset the layout, modal, and URLs to their defaults.
* The default and suggested URL lists are defined at the top of the script for easy editing.
