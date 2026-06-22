/* TooToo Lab — header.js  (the "where are we?" component).
   Ported from reference §8 (updateHeaderFromConfig) + appearance controls (§11).
   Reads: CONFIG + meta[revised]. Writes: state.owner/repo/branch (repo/branch
   pickers not built yet). Depends on globals CONFIG/state. */

const updateHeaderFromConfig = () => {
  if ( CONFIG.themeColor ) document.documentElement.style.setProperty( '--highlight-color', CONFIG.themeColor );
  const label = CONFIG.appName;
  const titleEl = document.getElementById( 'headerTitle' );
  document.title = CONFIG.subtitle ? `${ label } · ${ CONFIG.subtitle }` : label;
  titleEl.textContent = label;
  const revised = document.querySelector( 'meta[name="revised"]' )?.content || 'unknown';
  titleEl.title = `Last updated: ${ revised } · click to reload`;
  if ( CONFIG.subtitle ) {
    const sub = document.createElement( 'span' );
    sub.style.cssText = 'opacity: 0.6; font-weight: normal; margin-left: 0.4rem; font-size: 0.9rem;';
    sub.textContent = '· ' + CONFIG.subtitle;
    titleEl.appendChild( sub );
  }
};

/* Header owns the sidebar toggle (Ctrl/⌘ B + the ☰ button both call this). */
const toggleSidebar = () => {
  const hidden = document.body.classList.toggle( 'sidebar-hidden' );
  document.getElementById( 'btnToggleSidebar' )?.setAttribute( 'aria-expanded', String( !hidden ) );
  try { localStorage.setItem( storageKey( 'sidebarHidden' ), hidden ? '1' : '0' ); } catch ( _ ) { /* storage off */ }
};

const initHeaderControls = () => {
  document.getElementById( 'btnDarkMode' )?.addEventListener( 'click', () => {
    const isDark = document.body.classList.toggle( 'dark-mode' );
    setHljsTheme( isDark );
    try { localStorage.setItem( storageKey( 'darkMode' ), isDark ? '1' : '0' ); } catch ( _ ) { /* storage off */ }
  } );

  let fontSize = 16;
  const setFont = ( n ) => {
    fontSize = Math.min( 24, Math.max( 11, n ) );
    document.documentElement.style.setProperty( '--font-size', fontSize + 'px' );
  };
  document.getElementById( 'btnFontDec' )?.addEventListener( 'click', () => setFont( fontSize - 1 ) );
  document.getElementById( 'btnFontInc' )?.addEventListener( 'click', () => setFont( fontSize + 1 ) );

  document.getElementById( 'btnHelp' )?.addEventListener( 'click', () => toggleInfoPanel( 'about' ) );
  document.getElementById( 'btnToken' )?.addEventListener( 'click', () => toggleInfoPanel( 'token' ) );

  document.getElementById( 'btnToggleSidebar' )?.addEventListener( 'click', toggleSidebar );

  const rb = document.getElementById( 'rateBadge' );
  if ( rb ) { rb.textContent = '4983 / 5000'; rb.style.display = 'inline-block'; }

  document.getElementById( 'headerGitHub' )?.setAttribute( 'href', CONFIG.sourceRepoUrl || '#' );
};

/* ── token panel (header owns the dialog; it renders into the content area) ── */
const showTokenPanel = () => {
  const cb = document.getElementById( 'contentBody' );
  if ( !cb ) return;   // standalone header page has no content area
  const hasToken = getToken().length > 0;
  setContentHeader( makeSimpleHeader( 'GitHub Token' ) );
  cb.innerHTML = `
    <div class="markdown-body">
      <p>${ escapeHTML( CONFIG.appName ) } reads the GitHub API — <strong>60 requests/hour</strong> anonymous, <strong>5,000/hour</strong> with a token. The token is stored only in this browser's <code>localStorage</code> and sent only to <code>api.github.com</code>.</p>
      <p><a href="https://github.com/settings/tokens" target="_blank" rel="noopener">Create a token →</a> — a classic token with no scopes is enough for public repos.</p>
      <div class="repo-form">
        <label for="inpToken">Token${ hasToken ? ' (currently set)' : '' }</label>
        <input id="inpToken" type="password" placeholder="${ hasToken ? '•••••• (blank = keep)' : 'ghp_…' }" autocomplete="off" spellcheck="false">
        <label><input id="inpTokenShow" type="checkbox"> Show token</label>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button id="btnTokenSave" class="primary">Save</button>
          <button id="btnTokenClear" class="secondary">Clear</button>
        </div>
      </div>
      <hr style="margin:1rem 0;border:none;border-top:1px solid var(--border-color);">
      <p style="font-size:0.85rem;opacity:0.8;">Wipe every preference, cached file, and the token from this browser — useful when testing.</p>
      <button id="btnResetAll" class="secondary">Reset all data</button>
    </div>`;
  const inp = document.getElementById( 'inpToken' );
  inp.focus();
  document.getElementById( 'inpTokenShow' ).addEventListener( 'change', ( e ) => { inp.type = e.target.checked ? 'text' : 'password'; } );
  const save = () => {
    const v = inp.value;
    if ( v === '' && hasToken ) return;   // blank = keep existing
    try { localStorage.setItem( tokenStorageKey(), v ); } catch ( _ ) { /* storage disabled */ }
    clearFileCache();
    location.reload();
  };
  document.getElementById( 'btnTokenSave' ).addEventListener( 'click', save );
  inp.addEventListener( 'keydown', ( e ) => { if ( e.key === 'Enter' ) save(); } );
  document.getElementById( 'btnTokenClear' ).addEventListener( 'click', () => {
    try { localStorage.removeItem( tokenStorageKey() ); } catch ( _ ) { /* storage disabled */ }
    clearFileCache();
    location.reload();
  } );
  document.getElementById( 'btnResetAll' )?.addEventListener( 'click', () => {
    if ( !window.confirm( `Wipe all ${ CONFIG.appName } data from this browser?` ) ) return;
    try {
      const prefix = `${ CONFIG.storagePrefix }-lab:`;
      const keys = [];
      for ( let i = 0; i < localStorage.length; i++ ) { const k = localStorage.key( i ); if ( k && k.startsWith( prefix ) ) keys.push( k ); }
      for ( const k of keys ) localStorage.removeItem( k );
    } catch ( _ ) { /* storage disabled */ }
    clearFileCache();
    location.reload();
  } );
};

/* ── About panel + About/Token toggle (reference §12c). ? / ⚙️ open their panel;
   clicking again returns to the file you were on (panelReturnPath). ── */
let activePanel = null;       // 'about' | 'token' | null
let panelReturnPath = '';

const updateInfoButtonState = () => {
  const help = document.getElementById( 'btnHelp' );
  const token = document.getElementById( 'btnToken' );
  help?.classList.toggle( 'active', activePanel === 'about' );
  help?.setAttribute( 'aria-pressed', String( activePanel === 'about' ) );
  token?.classList.toggle( 'active', activePanel === 'token' );
  token?.setAttribute( 'aria-pressed', String( activePanel === 'token' ) );
};

const renderAboutPanel = async () => {
  const revised = document.querySelector( 'meta[name="revised"]' )?.content || 'unknown';
  const sourceUrl = CONFIG.sourceRepoUrl;
  const repoUrl = state.owner && state.repo ? `https://github.com/${ state.owner }/${ state.repo }` : sourceUrl;
  const tokenStatus = getToken() ? 'Set' : 'Not set (anonymous — 60 requests/hour)';

  let rateLimitInfo = 'Unable to fetch';
  try {
    const res = await fetch( 'https://api.github.com/rate_limit', { headers: ghHeaders() } );
    if ( res.ok ) { const core = ( await res.json() ).resources.core; rateLimitInfo = `${ core.remaining } / ${ core.limit } remaining`; }
  } catch ( _ ) { /* offline */ }

  const branchHtml = ( state.owner && state.repo && state.branch )
    ? `<li><strong>Branch:</strong> <a href="https://github.com/${ encodeURIComponent( state.owner ) }/${ encodeURIComponent( state.repo ) }/tree/${ encodeURIComponent( state.branch ) }" target="_blank" rel="noopener">${ escapeHTML( state.branch ) }</a></li>`
    : '';

  const statsHtml = ( () => {
    const stats = getRepoStats();
    if ( !stats ) return '<h3>Repository statistics</h3><p>No tree loaded yet.</p>';
    const types = stats.topTypes.map( ( [ ext, n ] ) => `<li>${ escapeHTML( ext ) }: ${ n }</li>` ).join( '' );
    const largest = stats.largest.map( ( f ) => `<li>${ escapeHTML( f.path ) } — ${ formatFileSize( f.size ) }</li>` ).join( '' );
    return `<h3>Repository statistics</h3><ul><li><strong>Files:</strong> ${ stats.fileCount }</li><li><strong>Folders:</strong> ${ stats.folderCount }</li><li><strong>Total size:</strong> ${ formatFileSize( stats.totalSize ) }</li></ul><h4>Top file types</h4><ol>${ types }</ol><h4>Largest files</h4><ol>${ largest }</ol>`;
  } )();

  setContentHeader( makeSimpleHeader( 'About' ) );
  document.getElementById( 'contentBody' ).innerHTML = `
    <div class="markdown-body">
      <h2>${ escapeHTML( CONFIG.appName ) }</h2>
      <p>A lightweight single-file GitHub repository browser (component build).</p>
      <ul>
        <li><strong>Source:</strong> <a href="${ escapeHTML( sourceUrl ) }" target="_blank" rel="noopener">${ escapeHTML( sourceUrl ) }</a></li>
        <li><strong>Repository:</strong> <a href="${ escapeHTML( repoUrl ) }" target="_blank" rel="noopener">${ escapeHTML( repoUrl ) }</a></li>
        ${ branchHtml }
        <li><strong>Updated:</strong> ${ escapeHTML( revised ) }</li>
        <li><strong>Token:</strong> ${ escapeHTML( tokenStatus ) }</li>
        <li><strong>Rate limit:</strong> ${ escapeHTML( rateLimitInfo ) }</li>
      </ul>
      ${ statsHtml }
      <h3>Keyboard shortcuts</h3>
      <ul>
        <li><kbd>Ctrl/⌘ B</kbd> — toggle sidebar</li>
        <li><kbd>/</kbd> focus filter · <kbd>Esc</kbd> clear filter</li>
        <li><kbd>↑</kbd> <kbd>↓</kbd> move · <kbd>→</kbd>/<kbd>←</kbd> open/close folder · <kbd>Enter</kbd> open</li>
      </ul>
      <h3>Maintenance</h3>
      <button id="btnSelfTest" class="secondary">🧪 Run self-test</button>
    </div>`;
  document.getElementById( 'btnSelfTest' )?.addEventListener( 'click', runSelfTest );
};

const closeInfoPanel = () => {
  activePanel = null;
  updateInfoButtonState();
  const path = panelReturnPath;
  panelReturnPath = '';
  if ( path && state.tree?.some( ( i ) => i.path === path && i.type === 'blob' ) ) selectFile( path );
  else autoSelectReadme();
};

const toggleInfoPanel = async ( panel ) => {
  if ( activePanel === panel ) { closeInfoPanel(); return; }
  if ( !activePanel ) panelReturnPath = state.currentFilePath || '';
  activePanel = panel;
  updateInfoButtonState();
  if ( panel === 'about' ) await renderAboutPanel();
  else showTokenPanel();
};

const initHeader = () => {
  updateHeaderFromConfig();
  try {
    if ( localStorage.getItem( storageKey( 'darkMode' ) ) === '1' ) {
      document.body.classList.add( 'dark-mode' );
      setHljsTheme( true );
    }
    if ( localStorage.getItem( storageKey( 'sidebarHidden' ) ) === '1' ) document.body.classList.add( 'sidebar-hidden' );
  } catch ( _ ) { /* storage off */ }
  initHeaderControls();
};
