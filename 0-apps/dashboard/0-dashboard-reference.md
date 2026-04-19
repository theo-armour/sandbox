# Dashboard Reference

## Core Recommendation

Use a grid of panels for the overall dashboard.

Use a table only inside a panel when the content is truly tabular:

* repeated rows
* consistent columns
* easy side-by-side comparison

Examples that fit a table:

* tasks with status, priority, due date
* appointments by day and time
* habit tracking by week
* metrics by date

Examples that do not fit a table well:

* clock
* weather summary
* notes
* quick links
* quote or prompt of the day
* countdowns
* small charts or progress meters

## Good Dashboard Pattern

Use this structure:

* top-level CSS Grid for page layout
* one card per widget or function
* optional table inside one card
* localStorage for lightweight persistence

This gives you:

* easier responsive behavior
* clearer visual grouping
* simpler maintenance
* freedom to mix text, controls, numbers, and lists

## Suggested Panels

Start with a small useful set:

1. Clock and date
2. Weather
3. Top 3 tasks
4. Quick links
5. Notes
6. Today table for schedule or task list

## Simple Wireframe

```html
<main class="dashboard-grid">
 <section class="panel panel-clock">
  <h2>Now</h2>
  <div id="clock">09:41</div>
  <div id="date">Sunday, April 19, 2026</div>
 </section>

 <section class="panel panel-weather">
  <h2>Weather</h2>
  <p>San Francisco</p>
  <p>58 F, breezy</p>
 </section>

 <section class="panel panel-focus">
  <h2>Top 3</h2>
  <ol>
   <li>Finish dashboard layout</li>
   <li>Reply to email</li>
   <li>Walk at 4 PM</li>
  </ol>
 </section>

 <section class="panel panel-links">
  <h2>Quick Links</h2>
  <ul>
   <li><a href="https://github.com">GitHub</a></li>
   <li><a href="https://calendar.google.com">Calendar</a></li>
   <li><a href="https://drive.google.com">Drive</a></li>
  </ul>
 </section>

 <section class="panel panel-table">
  <h2>Today</h2>
  <table>
   <thead>
    <tr>
     <th>Time</th>
     <th>Item</th>
     <th>Status</th>
    </tr>
   </thead>
   <tbody>
    <tr>
     <td>10:00</td>
     <td>Write notes</td>
     <td>Open</td>
    </tr>
    <tr>
     <td>14:00</td>
     <td>Review files</td>
     <td>Pending</td>
    </tr>
   </tbody>
  </table>
 </section>

 <section class="panel panel-notes">
  <h2>Notes</h2>
  <textarea placeholder="Add notes..."></textarea>
 </section>
</main>
```

## Layout Notes

```css
.dashboard-grid {
 display: grid;
 gap: 1rem;
 grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}

.panel {
 padding: 1rem;
 border-radius: 0.5rem;
}

.panel-table {
 grid-column: span 2;
}

@media (max-width: 700px) {
 .panel-table {
  grid-column: span 1;
 }
}
```

## Practical Rule

Do not build the whole dashboard as one table.

Build the dashboard as a grid of panels, then place a table inside a panel when comparison across rows and columns is the real job.

That is the safer default for a personal dashboard.
