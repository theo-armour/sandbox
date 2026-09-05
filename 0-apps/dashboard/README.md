# Personal Iframe Dashboard ~ Sandbox Upgrades

### 🚀 How to Run the Dashboard

Since GitHub's standard repository folder view displays source code rather than executing HTML webpages, you can launch the fully runnable application directly in your browser here:

👉 🌐 **[Live Cloud Version (via GitHub Pages)](https://theo-armour.github.io/sandbox/gemini/cookbook/dashboard-gemini/widgets-iframe/index.html)**

---

## 📦 Modular Architecture & Features

This project is a highly refined, modular personal dashboard built entirely with **semantic HTML5, vanilla CSS, and standard JavaScript**. There are no build tools, no framework overheads, and no external Node.js dependencies, keeping it extremely lightweight and local-first.

Each widget runs in its own `<iframe>` document, isolating its DOM and styles so a failed widget does not interrupt the dashboard shell. Same-origin widgets intentionally share browser storage by key; the iframes are not sandboxed.

---

## 🛠️ Refined Widgets & Upgrades

Here are the visual and functional enhancements integrated into your sandbox widgets:

### 1. 📅 Google Calendar Agenda ([widget-calendar.html](https://theo-armour.github.io/sandbox/gemini/cookbook/dashboard-gemini/widgets-iframe/widget-calendar.html))
* **Smart CSS Dark Filter**: Uses a media query for `prefers-color-scheme: dark` that applies `filter: invert(0.92) hue-rotate(180deg)` directly on the Google Calendar iframe. 
* **Native Integration**: Instantly transforms Google's default blinding white embed into a highly customized, eye-friendly dark-themed calendar that perfectly matches your OS color scheme.

### 2. ⏱️ Teodoro Activity Timer ([teodoro.html](https://theo-armour.github.io/sandbox/gemini/cookbook/dashboard-gemini/widgets-iframe/teodoro.html))
* **Active Overtime Beats**: Added a custom `@keyframes pulse-overtime` animation that gently scales and glows the timer display when counting overtime, giving clear visual cues.
* **Synthesized Zen Bell Chime**: Integrated a high-resonance Web Audio API chime (synthesizing E4, A4, C#5, E5 major chord harmonics) that rings for 3 seconds when the timer reaches `0`. This guarantees a highly reliable auditory alert even if the SomaFM Grovesalad radio stream takes time to buffer or fails to connect.
* **Sleek Custom Controls**: Upgraded the browser-default range volume slider to a customized, flat bar that scales dynamically when hovered.

### 3. 📝 Persistent Flow Notes ([widget-notes.html](https://theo-armour.github.io/sandbox/gemini/cookbook/dashboard-gemini/widgets-iframe/widget-notes.html))
* **Autosave Status Indicator**: Displays a minimalist `SAVED` badge in the header that fades in and out 1 second after you stop typing, confirming local storage safety.
* **Live Metadata Counters**: Displays real-time character and word count statistics in a footer row.
* **Accidental Clear Protection**: The "Clear" notes button requires a double-action. Click once to prompt `Confirm?` in a highlighted red state; it will automatically reset after 3 seconds of inactivity, preventing accidental note deletion.

### 4. 🤖 AI & Service Status Monitor ([widget-github.html](https://theo-armour.github.io/sandbox/gemini/cookbook/dashboard-gemini/widgets-iframe/widget-github.html))
* **Pulsing Indicator Dots**: Built soft breathing glow keyframe animations for the health dots (green breathing glow for active, orange pulse for warnings, and a rapid red scaling pulse for critical outages).
* **Manual Refresh Utility**: Created an elegant `↻` refresh button in the header that spins (`spin` keyframes) during fetch execution, enabling instant checks of Claude, ChatGPT, Gemini, and GitHub APIs without reloading your dashboard.
* **Auto-Refresh Loop**: Integrated a background `setInterval` loop that automatically checks statuses every 15 minutes.
