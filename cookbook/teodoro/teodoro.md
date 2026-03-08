# Teodoro ~ Countdown Timer App

Create a single-file HTML countdown timer app with these features:

## Timer Display & Controls
* Show remaining time as MM:SS, counting down to 00:00
* Preset buttons for 5 seconds, 5 minutes, 8 minutes, and 18 minutes — pressing a preset immediately starts the countdown
* A Pause/Resume button to pause and resume the running timer
* +/- buttons to add or subtract time: use seconds when the active preset is "5 sec", otherwise use minutes
* When the timer reaches zero, start playing the background music stream

## Music & Audio
* Background music stream: https://ice1.somafm.com/groovesalad-128-mp3
* Volume slider to control playback level; persist the setting in localStorage so it survives page reloads
* Clicking the speaker icon toggles mute
* At the halfway point of any countdown, play a short pleasant chime (synthesized via Web Audio API, randomly chosen from several melodic patterns), then continue counting down

## Appearance
* Respect the OS light/dark color scheme preference via `prefers-color-scheme`
* All buttons use bold, large, easy-to-read text
* Layout adapts fluidly from very small windows (down to ~120px wide) up to full screen using `clamp()` and viewport units — no fixed minimum widths, no overflow, text and controls scale down gracefully
* Single self-contained HTML file — no build tools, no frameworks, no external dependencies except the audio stream URL
