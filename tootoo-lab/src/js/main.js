/* TooToo Lab — main.js  (init + wiring) for the ASSEMBLED live build.
   Init order per ARCHITECTURE.md: header → content → footer → detect repo →
   sidebar → fetch tree → route to a file (hash or README). Reference §40. */

const initApp = async () => {
  initHeader();     // header.js  — branding + appearance controls
  initContent();    // content.js — wire Copy / view-toggle / etc.
  renderFooter();   // footer.js  — brand bar

  await detectLocalMode();  // core.js — file:// drop-in: seed owner/repo, read files from disk
  detectRepo();     // core.js    — ?owner=&repo=&branch=  →  CONFIG defaults (params win)
  initSidebar();    // sidebar.js — wire filter/expand/select (tree fills next)

  if ( !state.owner || !state.repo ) {
    document.getElementById( 'contentBody' ).innerHTML =
      '<p style="padding:1rem;">Add <code>?owner=…&amp;repo=…</code> to the URL to load a repository.</p>';
    return;
  }

  await fetchTree();                       // sidebar.js — GitHub tree → state.tree → render
  const hashPath = currentHashPath();      // core.js
  if ( hashPath ) selectFile( hashPath );  // content.js — deep-linked file
  else autoSelectReadme();                 // sidebar.js — default to README
};

initApp();
