# <a href="https://github.com/theo-armour/sandbox/tree/main/0-apps/notesy" title="Source code on GitHub"><img src="https://pushme-pullyou.github.io/assets/svg/octicon.svg" alt=""></a> <a href="https://github.com/theo-armour/sandbox/blob/main/0-apps/notesy/README.md">Notesy Read Me</a>

## Full Screen: <a href="https://theo-armour.github.io/sandbox/0-apps/notesy/notesy.html">Notesy</a>

Canonical home since 2026-06-12. Earlier dated versions remain in <a href="https://github.com/theo-armour/qdata/tree/main/apps/notesy">qdata/apps/notesy</a>; timestamped backups go in `.archive/`

## Concept

* Get and Put Markdown files to a private or public GitHub repo
* Display and edit in HTML; save as Markdown; supports details tag
* Toggle display content as html, Markdown or HTML text
* Select file and update via location.hash
* Autosave by time or on blur; check for change before exit
* Display Get and Put time and byte count
* My primary test bed for Markdown to HTML and back; load test files
* Footer dingbat to go to top of page

## To Do / Wish List

* 2026-06-12 ~ bring the iframe test harness (notesy-test-iframe.html, menu-test.html) over from qdata
* Notesy: retrieve 2024 data from archive
* Notesy: fix masthead link so that it points to the file in use and not the notes file
* 2024-12-25 ~ improve styles?
* 2024-08-23 ~ more messages about onBlur
* 2024-08-23 ~ show time since last save
* 2023-10-15 ~ add ability to save to local storage
* 2023-10-15 ~ check save time across multiple iframes
* TooToo with Notesy support

## Change Log

### 2026-06-12

* Fix: failed save no longer locks up syncing ~ error path threw on `responseText`; `isSyncing` now always resets
* Fix: load errors show a message; 401/403 clears the stored token so a reload re-prompts; bad URL hash handled
* Fix: no phantom autosave after load ~ no-change checks compare `editorBaseline` (innerText-normalized); overwrite guard compares raw GitHub content
* New: warn before overwriting a file changed on GitHub since load; Cancel pauses autosave
* Cleanup: dead `autoSave()` toggle branch removed; locale-safe timestamps; no-op CSS removed
* Tighten: removed dead CSS (editor is plain text ~ p/ul/h1 etc never render), unused `lastSyncTime` and `spnVersion`, stale commented presets, console.logs; base64 code now shared `decodeBase64()`/`encodeBase64()` helpers
* New: multi-instance support ~ when there are no local edits, each autosave tick (and window focus) quietly pulls the latest version from GitHub, so instances in other tabs/browsers/computers stay in step; conflict prompt now only fires on truly simultaneous edits
* Moved: canonical home is now sandbox/0-apps/notesy (was qdata/apps/notesy) ~ source link and notesyURL updated; timestamped backups now live in .archive/

### 2024-12-24

* Links in titles now work to launch the current file in new tab. Helps Trayo

### 2024-09-22

Done or dealt with

* 2024-09-22 ~ allow for comments in the Markdown: it's already in

### 2024-09-20

Done

* 2023-10-18 ~ Display .txt files as txt

### 2024-09-19

Is it finished? Notesy seems to be doing just about everything I wanted it to do. There may be a few more fixes. regex I can simplify. Better security for storing the password.

Done or dealt with

* 2024-08-23 ~ top row stays visible

### 2024-08-17

* Many fixes
* 2023-10-15 ~ Check alternatives to ShowDown &lt; not
* Ability to view content as pure text
* See if CKEditor be any better? &lt; not

### 2024-08-02

* Testing

### 2024-01-15

* README.md update to qdata folder

### 2023-10-17

* Fixed: 2023-10-16 ~ Deal with three spaces in list items
* Fixed: 2023-10-15 ~ stop loading two files in iframes - double init() in Trayo

### 2023-10-15

* Mostly fixed: Fix notesy asterisk issues

### 2023-05-08

* add lastSaveTime: &gt; 30 seconds
* Add saving = true || false

### 2023-04-30

* Works well with links to snippet files in newwwtab
* Automatically creates Markdown link references to text that is a link. I did not want, but then again this allows the text of the link to be edited upon a reload

### 2023-04-10

* onBlur event update from window to divContent
* Add function reminder to tooltips
* Add getSha()
* Add delSha() function
* Will keep prompting for GitHub credentials until they are correct

### 2023-02-19

* Good cleanup

### 2023-02-17

* First commit

***

<center title="Hello! Click me to go up to the top"><a class="aDingbat" href="javascript:divContent.scrollTo(0,0);">❦</a></center>
