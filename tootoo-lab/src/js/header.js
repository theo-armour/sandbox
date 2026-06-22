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

const initHeaderControls = () => {
  document.getElementById( 'btnDarkMode' )?.addEventListener( 'click', () =>
    document.body.classList.toggle( 'dark-mode' ) );

  let fontSize = 16;
  const setFont = ( n ) => {
    fontSize = Math.min( 24, Math.max( 11, n ) );
    document.documentElement.style.setProperty( '--font-size', fontSize + 'px' );
  };
  document.getElementById( 'btnFontDec' )?.addEventListener( 'click', () => setFont( fontSize - 1 ) );
  document.getElementById( 'btnFontInc' )?.addEventListener( 'click', () => setFont( fontSize + 1 ) );

  document.getElementById( 'btnHelp' )?.addEventListener( 'click', ( e ) => e.currentTarget.classList.toggle( 'active' ) );
  document.getElementById( 'btnToken' )?.addEventListener( 'click', ( e ) => { e.currentTarget.classList.toggle( 'active' ); showTokenPanel(); } );

  // Header owns the sidebar toggle (cross-component: hides the sidebar).
  document.getElementById( 'btnToggleSidebar' )?.addEventListener( 'click', ( e ) => {
    const hidden = document.body.classList.toggle( 'sidebar-hidden' );
    e.currentTarget.setAttribute( 'aria-expanded', String( !hidden ) );
  } );

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
};

const initHeader = () => { updateHeaderFromConfig(); initHeaderControls(); };
