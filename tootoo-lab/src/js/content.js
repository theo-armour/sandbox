/* TooToo Lab — content.js  (the "show the file & act on it" component).
   Ported from reference §32, §33, §37, §38. Reads: state.owner/repo/branch,
   CONFIG. Writes: state.currentFilePath (Content owns this). Depends on core.js
   + marked/hljs/DOMPurify (CDN, same as the real app).

   LAB SIMPLIFICATIONS vs the real app:
   - selectFile reads `mockFiles` instead of fetching GitHub/local.
   - audio/video/pdf/spreadsheet renderers are omitted for now (need real blobs).
   - markdown image/relative-link resolution against the repo is dropped (mock). */

let lastRawText = '';

/* ── file-header: breadcrumbs + action buttons (reference §32) ── */
const buildFileHeader = ( path, ext ) => {
  const segments = path.split( '/' );
  const fileName = segments.pop();

  const folderLink = ( seg, fPath ) =>
    `<a class="breadcrumb-link" href="#" data-action="scroll-folder" data-folder="${ escapeHTML( fPath ) }" title="${ escapeHTML( fPath ) }">${ escapeHTML( seg ) }</a>`;

  const cumulative = [];
  segments.forEach( ( seg ) => {
    const prev = cumulative[ cumulative.length - 1 ];
    cumulative.push( prev ? `${ prev }/${ seg }` : seg );
  } );

  let pathHtml = '';
  if ( segments.length > 2 ) {
    const last = segments.length - 1;
    pathHtml =
      `<span class="crumb-collapsed" title="${ escapeHTML( segments.slice( 0, last ).join( ' / ' ) ) }">…</span> / ` +
      folderLink( segments[ last ], cumulative[ last ] ) + ' / ';
  } else if ( segments.length > 0 ) {
    pathHtml = segments.map( ( seg, i ) => folderLink( seg, cumulative[ i ] ) ).join( ' / ' ) + ' / ';
  }

  const breadcrumbHtml =
    `<span class="crumb-path">${ pathHtml }</span>` +
    `<strong class="crumb-file">${ escapeHTML( fileName ) }</strong>`;

  const githubUrl = `https://github.com/${ encodeURIComponent( state.owner ) }/${ encodeURIComponent( state.repo ) }/blob/${ encodeURIComponent( state.branch ) }/${ encodePath( path ) }`;

  const hasToggle = [ 'md', 'html', 'htm', 'svg' ].includes( ext );
  const hasCopy = !NO_COPY_EXTS.includes( ext ) || ext === 'svg';
  const preferredView = hasToggle ? getPreferredView( ext ) : 'rendered';

  let actionsHtml = '';
  if ( hasToggle ) {
    const showingRaw = preferredView === 'raw';
    const otherIcon = showingRaw ? '👁' : '&lt;/&gt;';
    const otherTitle = showingRaw ? 'Show rendered view' : 'Show raw source';
    actionsHtml += `<button class="file-btn" data-action="view-toggle" title="${ otherTitle }" aria-label="${ otherTitle }">${ otherIcon }</button>`;
  }
  if ( hasCopy ) {
    actionsHtml += `<button class="file-btn" data-action="copy-file" title="Copy file contents to clipboard" aria-label="Copy file contents to clipboard">📋</button>`;
  }
  actionsHtml += `<button class="file-btn" data-action="print" title="Print this file" aria-label="Print this file">🖨</button>`;
  const willDownload = isDownloadAction( ext ) && !isTextOpenAsPlain( ext );
  const newTabIcon = willDownload ? '⬇' : '↗';
  const newTabTitle = willDownload ? 'Download this file' : 'Open in new tab';
  actionsHtml += `<button class="file-btn" data-action="new-tab" data-path="${ escapeHTML( path ) }" title="${ newTabTitle }" aria-label="${ newTabTitle }">${ newTabIcon }</button>`;

  return `<div class="panel-header file-header">` +
    `<div class="file-title">` +
    `<a href="${ escapeHTML( githubUrl ) }" target="_blank" rel="noopener" title="View on GitHub" aria-label="View this file on GitHub">${ GITHUB_SVG_ICON }</a>` +
    `<h3 id="breadcrumbs" title="${ escapeHTML( path ) }">${ breadcrumbHtml }</h3>` +
    `</div>` +
    `<div class="file-actions">${ actionsHtml }</div>` +
    `</div>`;
};

/* ── renderers (reference §33) ── */
const buildToggleHtml = ( ext, renderedHtml, rawText, { prefix = '', renderedClass = '' } = {} ) => {
  const preferredView = getPreferredView( ext );
  const renderedDisplay = preferredView === 'rendered' ? '' : 'display:none';
  const rawDisplay = preferredView === 'raw' ? '' : 'display:none';
  const classAttr = renderedClass ? ` class="${ renderedClass }"` : '';
  return prefix +
    `<div${ classAttr } id="viewRendered" style="${ renderedDisplay }">${ renderedHtml }</div>` +
    `<pre id="viewRaw" style="${ rawDisplay }">${ escapeHTML( rawText ) }</pre>`;
};

const renderMarkdown = ( text, filePath ) => {
  let renderedHtml, errorHtml = '';
  try { renderedHtml = DOMPurify.sanitize( marked.parse( text ) ); }
  catch ( err ) { errorHtml = `<div class="md-error">⚠️ Markdown rendering failed: ${ escapeHTML( err.message ) }</div>`; renderedHtml = ''; }

  document.getElementById( 'contentBody' ).innerHTML =
    buildToggleHtml( 'md', renderedHtml, text, { prefix: errorHtml, renderedClass: 'markdown-body' } );

  const mdBody = document.getElementById( 'viewRendered' );
  if ( !mdBody ) return;
  mdBody.querySelectorAll( 'a[href]' ).forEach( ( a ) => {
    const href = a.getAttribute( 'href' );
    if ( !href || href.startsWith( '#' ) ) return;
    if ( /^https?:\/\//.test( href ) ) { a.target = '_blank'; a.rel = 'noopener'; return; }
    // Relative/in-repo link → load via selectFile (lab: no path resolution yet).
    const repoPath = href.replace( /^\.?\//, '' );
    a.removeAttribute( 'href' ); a.classList.add( 'internal-link' );
    a.addEventListener( 'click', ( e ) => { e.preventDefault(); selectFile( repoPath ); } );
  } );
  mdBody.querySelectorAll( 'pre code' ).forEach( ( el ) => {
    try { hljs.highlightElement( el ); } catch ( _ ) { /* plain fallback */ }
  } );
};

const renderCode = ( text, ext ) => {
  const skipHighlight = !ext || text.length > 500 * 1024;
  const code = document.createElement( 'code' );
  code.textContent = text;
  if ( !skipHighlight ) { try { hljs.highlightElement( code ); } catch ( _ ) { /* plain */ } }
  const pre = document.createElement( 'pre' );
  pre.appendChild( code );
  const body = document.getElementById( 'contentBody' );
  body.innerHTML = '';
  body.appendChild( pre );
};

const renderHtml = ( text, ext ) => {
  const url = createBlobUrl( new Blob( [ text ], { type: 'text/html' } ) );
  const note = `<div class="md-error">ℹ️ Preview is sandboxed: scripts and relative assets are disabled. Use ↗ New Tab for the live page.</div>`;
  document.getElementById( 'contentBody' ).innerHTML =
    buildToggleHtml( ext, `${ note }<iframe class="iframe-content" sandbox src="${ escapeHTML( url ) }"></iframe>`, text );
};

const renderSvg = ( text, fileName = 'SVG image' ) => {
  const url = createBlobUrl( new Blob( [ text ], { type: 'image/svg+xml' } ) );
  document.getElementById( 'contentBody' ).innerHTML =
    buildToggleHtml( 'svg', `<img class="media-content" src="${ escapeHTML( url ) }" alt="${ escapeHTML( fileName ) }">`, text );
};

const renderImage = ( url, alt ) => {
  document.getElementById( 'contentBody' ).innerHTML =
    `<img class="media-content" src="${ escapeHTML( url ) }" alt="${ escapeHTML( alt ) }">`;
};

const renderAudio = ( url ) => {
  document.getElementById( 'contentBody' ).innerHTML =
    `<audio controls class="media-content" src="${ escapeHTML( url ) }">Your browser does not support audio.</audio>`;
};

const renderVideo = ( url ) => {
  document.getElementById( 'contentBody' ).innerHTML =
    `<video controls class="media-content" src="${ escapeHTML( url ) }">Your browser does not support video.</video>`;
};

const renderPdf = ( url ) => {
  document.getElementById( 'contentBody' ).innerHTML =
    `<iframe class="iframe-content" src="${ escapeHTML( url ) }"></iframe>`;
};

// SheetJS (~700KB) is injected on first spreadsheet open, not on every page.
let xlsxLoader = null;
const ensureXLSX = () => {
  if ( window.XLSX ) return Promise.resolve();
  if ( xlsxLoader ) return xlsxLoader;
  xlsxLoader = new Promise( ( resolve, reject ) => {
    const s = document.createElement( 'script' );
    s.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    s.onload = resolve;
    s.onerror = () => { xlsxLoader = null; reject( new Error( 'Failed to load the spreadsheet library (SheetJS).' ) ); };
    document.head.appendChild( s );
  } );
  return xlsxLoader;
};

const renderSpreadsheet = async ( data ) => {
  try {
    await ensureXLSX();
    const workbook = XLSX.read( data, { type: 'array' } );
    let html = '';
    for ( const sheetName of workbook.SheetNames ) {
      html += `<div class="xlsx-sheet"><h3>${ escapeHTML( sheetName ) }</h3>${ XLSX.utils.sheet_to_html( workbook.Sheets[ sheetName ] ) }</div>`;
    }
    document.getElementById( 'contentBody' ).innerHTML = DOMPurify.sanitize( html );
  } catch ( err ) {
    document.getElementById( 'contentBody' ).innerHTML =
      `<p style="color: red;">Failed to parse spreadsheet: ${ escapeHTML( err.message ) }</p>`;
  }
};

// A plain content header (no breadcrumbs/actions) — used by panels like the token form.
const makeSimpleHeader = ( title ) => {
  const d = document.createElement( 'div' );
  d.className = 'panel-header file-header';
  d.innerHTML = `<div class="file-title"><h3 id="breadcrumbs">${ escapeHTML( title ) }</h3></div>`;
  return d;
};

/* ── swap the sticky file-header in place ── */
const setContentHeader = ( el ) => {
  const area = document.getElementById( 'contentArea' );
  const existing = area.querySelector( '.file-header' );
  if ( existing ) existing.replaceWith( el ); else area.prepend( el );
};

/* ── selectFile: build header, fetch, dispatch by type (reference §37).
   fetchFileText reads mockFiles on standalone pages, raw GitHub in the live
   build — so the same selectFile works offline and online. ── */
const selectFile = async ( path ) => {
  const ext = path.includes( '.' ) ? path.split( '.' ).pop().toLowerCase() : '';
  state.currentFilePath = path;               // Content owns this
  const signal = newAbort();                  // cancel any in-flight load

  // Highlight the matching tree row, if a sidebar is present.
  document.querySelectorAll( '.tree-item' ).forEach( ( el ) =>
    el.classList.toggle( 'active', el.dataset.path === path ) );

  const hdr = document.createElement( 'div' );
  hdr.innerHTML = buildFileHeader( path, ext );
  setContentHeader( hdr.firstElementChild );

  const body = document.getElementById( 'contentBody' );
  body.innerHTML = '<p>Loading…</p>';

  try {
    if ( IMAGE_EXTS.includes( ext ) && ext !== 'svg' ) {
      lastRawText = '';
      renderImage( resolveMediaUrl( path ), path.split( '/' ).pop() );
    } else if ( AUDIO_EXTS.includes( ext ) ) {
      lastRawText = '';
      renderAudio( await fetchFileBlob( path, MIME[ ext ], signal ) );
    } else if ( VIDEO_EXTS.includes( ext ) ) {
      lastRawText = '';
      renderVideo( await fetchFileBlob( path, MIME[ ext ], signal ) );
    } else if ( ext === 'pdf' ) {
      lastRawText = '';
      renderPdf( await fetchFileBlob( path, 'application/pdf', signal ) );
    } else if ( SHEET_EXTS.includes( ext ) ) {
      lastRawText = '';
      await renderSpreadsheet( await fetchFileArrayBuffer( path, signal ) );
    } else {
      const text = await fetchFileText( path, signal );
      lastRawText = text;
      if ( ext === 'md' ) renderMarkdown( text, path );
      else if ( ext === 'svg' ) renderSvg( text, path.split( '/' ).pop() );
      else if ( ext === 'html' || ext === 'htm' ) renderHtml( text, ext );
      else renderCode( text, ext );
    }
    updateHash( path );
  } catch ( err ) {
    if ( err.name === 'AbortError' ) return;   // superseded by a newer selection
    lastRawText = '';
    body.innerHTML = `<p style="color:red;">${ escapeHTML( err.message ) }</p>`;
  }
  document.getElementById( 'contentArea' ).scrollTo( { top: 0 } );
};

/* ── content actions: view toggle, copy, print, new-tab (reference §38) ── */
const setupContentActions = () => {
  document.getElementById( 'contentArea' ).addEventListener( 'click', async ( e ) => {
    const toggleBtn = e.target.closest( '[data-action="view-toggle"]' );
    if ( toggleBtn ) {
      const viewRendered = document.getElementById( 'viewRendered' );
      const viewRaw = document.getElementById( 'viewRaw' );
      const ext = state.currentFilePath.split( '.' ).pop().toLowerCase();
      const goingToRaw = getPreferredView( ext ) === 'rendered';
      if ( viewRendered ) viewRendered.style.display = goingToRaw ? 'none' : '';
      if ( viewRaw ) viewRaw.style.display = goingToRaw ? '' : 'none';
      toggleBtn.textContent = goingToRaw ? '👁' : '</>';
      const t = goingToRaw ? 'Show rendered view' : 'Show raw source';
      toggleBtn.title = t; toggleBtn.setAttribute( 'aria-label', t );
      setPreferredView( ext, goingToRaw ? 'raw' : 'rendered' );
      return;
    }
    const copyBtn = e.target.closest( '[data-action="copy-file"]' );
    if ( copyBtn && lastRawText ) {
      try {
        await navigator.clipboard.writeText( lastRawText );
        const orig = copyBtn.textContent; copyBtn.textContent = '✓';
        setTimeout( () => { copyBtn.textContent = orig; }, 1200 );
      } catch ( _ ) { /* clipboard blocked */ }
      return;
    }
    const printBtn = e.target.closest( '[data-action="print"]' );
    if ( printBtn ) { window.print(); return; }

    const newTabBtn = e.target.closest( '[data-action="new-tab"]' );
    if ( newTabBtn && lastRawText ) {
      const url = createBlobUrl( new Blob( [ lastRawText ], { type: 'text/plain;charset=utf-8' } ) );
      window.open( url, '_blank', 'noopener' );
      return;
    }
    // scroll-folder breadcrumb: no tree in this standalone page — ignore.
  } );
};

const initContent = () => setupContentActions();
