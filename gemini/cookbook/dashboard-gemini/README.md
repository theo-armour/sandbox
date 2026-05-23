# Personal Iframe Dashboard ~ Sandbox Upgrades

🚀 **[Launch Personal Iframe Dashboard](widgets-iframe/index.html)**

This project is a highly refined, modular personal dashboard built entirely with **semantic HTML5, vanilla CSS, and standard JavaScript**. There are no build tools, no framework overheads, and no external Node.js dependencies, making it extremely lightweight and compatible with standard `file://` protocols and static cloud hosting (such as GitHub Pages).

Each widget runs as a fully isolated, sandboxed `<iframe>` layout. This ensures complete code, style, and storage safety: a single failing widget never interrupts or crashes the rest of your dashboard shell.

---

## 🛠️ Refined Widgets & Upgrades

Here are the premium visual and functional enhancements integrated into the sandbox widgets:

### 1. 📅 Google Calendar Agenda ([widget-calendar.html](widgets-iframe/widget-calendar.html))
* **Smart CSS Dark Filter**: Uses a media query for `prefers-color-scheme: dark` that applies `filter: invert(0.92) hue-rotate(180deg)` directly on the Google Calendar iframe. 
* **Native Integration**: Instantly transforms Google's default blinding white embed into a highly customized, eye-friendly dark-themed calendar that perfectly matches your OS color scheme.

### 2. ⏱️ Teodoro Activity Timer ([teodoro.html](widgets-iframe/teodoro.html))
* **Active Overtime Beats**: Added a custom `@keyframes pulse-overtime` animation that gently scales and glows the timer display when counting overtime, giving clear visual cues.
* **Synthesized Zen Bell Chime**: Integrated a high-resonance Web Audio API chime (synthesizing E4, A4, C#5, E5 major chord harmonics) that rings for 3 seconds when the timer reaches `0`. This guarantees a highly reliable auditory alert even if the SomaFM Grovesalad radio stream takes time to buffer or fails to connect.
* **Sleek Custom Controls**: Upgraded the browser-default range volume slider to a customized, flat bar that scales dynamically when hovered.

### 3. 📝 Persistent Flow Notes ([widget-notes.html](widgets-iframe/widget-notes.html))
* **Autosave Status Indicator**: Displays a minimalist `SAVED` badge in the header that fades in and out 1 second after you stop typing, confirming local storage safety.
* **Live Metadata Counters**: Displays real-time character and word count statistics in a footer row.
* **Accidental Clear Protection**: The "Clear" notes button requires a double-action. Click once to prompt `Confirm?` in a highlighted red state; it will automatically reset after 3 seconds of inactivity, preventing accidental note deletion.

### 4. 🤖 AI & Service Status Monitor ([widget-github.html](widgets-github.html))
* **Pulsing Indicator Dots**: Built soft breathing glow keyframe animations for the health dots (green breathing glow for active, orange pulse for warnings, and a rapid red scaling pulse for critical outages).
* **Manual Refresh Utility**: Created an elegant `↻` refresh button in the header that spins (`spin` keyframes) during fetch execution, enabling instant checks of Claude, ChatGPT, Gemini, and GitHub APIs without reloading your dashboard.
* **Auto-Refresh Loop**: Integrated a background `setInterval` loop that automatically checks statuses every 15 minutes.

---

## 🚀 How to Run Locally

Because some widgets utilize advanced browser hardware APIs (like Web Audio capture or device permissions), browsers enforce strict **Secure Context** rules:

### 1. Simple Local Server (Recommended)
To run the dashboard locally with full hardware features active, open a terminal in the project directory and start a local server:
```powershell
# Serve inside the widgets-iframe directory
cd "G:\My Drive\2026-theo-github\theo-armour-sandbox\gemini\cookbook\dashboard-gemini\widgets-iframe"
python -m http.server 8000
```
Open your browser and navigate to:
👉 **`http://localhost:8000`**

### 2. Secure File Protocol Flags
Alternatively, you can launch your browser with the file access flag enabled:
```bash
--allow-file-access-from-files
```
Then, double-click **[index.html](widgets-iframe/index.html)** to run it directly from your file system.
