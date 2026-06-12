# Teodoro ~ Countdown Timer App

Create a single-file HTML countdown timer app with these features:

## Timer Display & Controls
* Show remaining time as MM:SS, counting down to 00:00
* Preset buttons for 5 seconds, 5 minutes, 8 minutes, and 18 minutes — pressing a preset immediately starts the countdown
* A Pause button that toggles to "Resume" or "Restart" as appropriate
* Space bar toggles pause/resume regardless of which element has focus
* +/- buttons to add or subtract time: use seconds when the active preset is 5s, otherwise use minutes
* When +/- adjusts time, update `totalTime` so the halfway chime point recalculates correctly
* Store `currentPreset` as a number, not a string
* When the timer reaches zero, start playing the background music stream
* After reaching zero, continue counting up — display elapsed overtime in red numbers
* During overtime, pause/space pauses the count-up and music; resume continues overtime
* After 12 minutes of overtime, automatically pause everything (stop counting, stop music)
* Pressing a preset resets the overtime and starts a new countdown
* During overtime, +/− buttons are disabled
* "Restart" re-runs the last preset's duration

## Music & Audio
* Background music stream: https://ice1.somafm.com/groovesalad-128-mp3
* Volume slider to control playback level; persist the setting in localStorage so it survives page reloads
* Clicking the speaker icon toggles mute
* At the halfway point of any countdown, play a short pleasant chime (synthesized via Web Audio API, randomly chosen from several melodic patterns), then continue counting down
* Do not set `stream.currentTime` on the live stream — it's a no-op and may cause errors

## Appearance
* Minimalist, Flat, System-Native design (system fonts, monochrome palette, no heavy shadows or borders)
* Respect OS light/dark color scheme via `prefers-color-scheme`
* All buttons use bold, large, easy-to-read text
* Layout adapts fluidly from ~100px wide up to full screen using `clamp()` and viewport units — no fixed minimum widths, no overflow, text and controls scale down gracefully
* Must work well embedded in a small iframe panel (compact gaps, small clamp minimums, `100dvh` body height)
* Single self-contained HTML file — no build tools, no frameworks, no external dependencies except the audio stream URL

## Snapshot Workflow
* Before each editing session, copy `teodoro.html` to `teodoro-YYYY-MM-DD-HHmm.html` (e.g. `teodoro-2026-04-18-1556.html`)
* Log each snapshot in `0-teodoro-journal.md` with a one-line note about what that version represents
* At end of day, open snapshots in browser, delete redundant ones, keep meaningful states

