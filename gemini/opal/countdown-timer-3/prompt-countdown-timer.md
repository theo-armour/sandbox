# Countdown Timer

Create a single-file HTML application that functions as a custom countdown timer.

## Features
*   **Display**: Extra large, easy-to-read digital clock showing MM:SS.
*   **Progress Visualization**: A visual progress indicator (e.g., a shrinking bar or a circular ring) that depletes as the timer counts down.
*   **Input**: An on-screen numeric keypad (0-9 and "00") for entering minutes and seconds. Includes a "Clear" button to remove the last digit. Input should behave like a microwave timer (digits shift left). Limit input to 4 digits.
*   **Controls**:
*   **Start**: Begins the countdown.
*   **Pause**: Freezes the timer.
*   **Reset**: Stops the timer and clears the input to 00:00.
*   **Keyboard Support**: Enable physical keyboard interaction: digits (0-9) for input, 'Backspace' for clearing, 'Enter' for Start, and 'Space' for Pause/Resume.
*   **Persistence**: Use `localStorage` to persist the last entered time so it remains available after a page refresh.
*   **Screen Wake Lock**: Prevent the device screen from sleeping while the timer is active using the Screen Wake Lock API.
*   **Alerts**: Display a visual indicator (e.g., background color change) and a generated sound (Web Audio API) when the timer reaches zero (no external audio files).
*   **Styling**: Minimalist, centered layout. Ensure all buttons (keypad and controls) have uniform size and alignment. Use large typography for the display and keypad numbers.
*   **Responsiveness**: Responsive design for desktop and mobile browsers. Ensure the layout fits entirely within the screen size (viewport) to prevent scrolling.
*   **Accessibility**: Ensure buttons have aria-labels and the timer is readable by screen readers.
