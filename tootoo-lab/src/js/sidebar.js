/* TooToo Lab — sidebar.js  (the "what files exist & how they're shown" component).
   Ported from reference §18-§26. Reads: state.tree, CONFIG.hidden*.
   Writes: nothing global — display only. Hands off via Content's selectFile(path).
   Depends on core.js helpers + globals CONFIG/state (mock-data.js).

   NOTE: the real renderTree batches with a "% rendered" status for huge repos;
   here it's synchronous for clarity. Re-add batching when we carve for real. */

/* ── build nested tree from the flat GitHub list ── */
const buildNestedTree = ( flatTree ) => {
  const root = { children: {} };
  const hidFolders = hiddenFolderSet();
  const hidFiles = hiddenFileSet();
  for ( const item of flatTree ) {
    if ( !isVisibleTreeItem( item, hidFolders, hidFiles ) ) continue;
    const parts = item.path.split( '/' );
    let current = root;
    for ( let i = 0; i < parts.length; i++ ) {
      const part = parts[ i ];
      if ( !current.children[ part ] ) {
        current.children[ part ] = { children: {}, type: null, size: null, path: null };
      }
      if ( i === parts.length - 1 ) {
        current.children[ part ].type = item.type;
        current.children[ part ].size = item.size;
        current.children[ part ].path = item.path;
      }
      current = current.children[ part ];
    }
  }
  return root;
};

/* ── sort: folders first, then alphabetical ── */
const sortedEntries = ( children ) =>
  Object.entries( children ).sort( ( [ aName, aNode ], [ bName, bNode ] ) => {
    const aIsFolder = aNode.type === 'tree' || Object.keys( aNode.children ).length > 0;
    const bIsFolder = bNode.type === 'tree' || Object.keys( bNode.children ).length > 0;
    if ( aIsFolder && !bIsFolder ) return -1;
    if ( !aIsFolder && bIsFolder ) return 1;
    return aName.toLowerCase().localeCompare( bName.toLowerCase() );
  } );

/* ── one tree node -> HTML (recursive for folders) ── */
const renderNode = ( name, node, parentPath ) => {
  const fullPath = parentPath ? `${ parentPath }/${ name }` : name;
  const isFolder = node.type === 'tree' || Object.keys( node.children ).length > 0;
  const displayName = displayTreeName( name );

  if ( isFolder ) {
    const childrenHtml = sortedEntries( node.children )
      .map( ( [ childName, childNode ] ) => renderNode( childName, childNode, fullPath ) )
      .join( '' );
    return `<details data-folder-path="${ escapeHTML( fullPath ) }">` +
      `<summary class="tree-folder" tabindex="0" title="${ escapeHTML( fullPath ) }">` +
      `<span aria-hidden="true">📁</span> <span class="folder-name">${ escapeHTML( displayName ) }</span>` +
      `</summary>` + childrenHtml + `</details>`;
  }

  const icon = getFileIcon( name );
  const sizeStr = formatFileSize( node.size );
  const isReadme = /^readme/i.test( name );
  const nameHtml = isReadme ? `<strong>${ escapeHTML( displayName ) }</strong>` : escapeHTML( displayName );
  const folderDisplay = parentPath ? parentPath.split( '/' ).map( displayTreeName ).join( ' / ' ) : '';
  const folderHtml = folderDisplay ? `<span class="tree-item-folder">${ escapeHTML( folderDisplay ) }</span>` : '';

  return `<div class="tree-item" role="button" tabindex="0" data-action="select-file" data-path="${ escapeHTML( fullPath ) }" title="${ escapeHTML( fullPath ) }">` +
    `<span class="tree-item-name"><span aria-hidden="true">${ icon }</span> ${ nameHtml }</span>` +
    `<span class="tree-item-size">${ sizeStr }</span>` + folderHtml + `</div>`;
};

/* ── expand-all glyph state ── */
const setExpandAllButton = ( expanded ) => {
  const btn = document.getElementById( 'btnExpandAll' );
  if ( !btn ) return;
  btn.textContent = expanded ? '⊟' : '⊞';
  const label = expanded ? 'Collapse all folders' : 'Expand all folders';
  btn.title = label;
  btn.setAttribute( 'aria-label', label );
};

/* ── render the whole tree ── */
const renderTree = ( treeArray ) => {
  const treeList = document.getElementById( 'treeList' );
  preFilterOpenState = null;
  setExpandAllButton( false );
  const nested = buildNestedTree( treeArray );
  const entries = sortedEntries( nested.children );
  treeList.innerHTML = entries.map( ( [ name, node ] ) => renderNode( name, node, '' ) ).join( '' );
  refreshTreeCache();
};

/* ── filter (reference §23) ── */
let preFilterOpenState = null;
let treeSummaryText = '';
let cachedTreeItems = [];
let cachedTreeFolders = [];

const refreshTreeCache = () => {
  const treeList = document.getElementById( 'treeList' );
  cachedTreeItems = Array.from( treeList.querySelectorAll( '.tree-item' ) );
  cachedTreeFolders = Array.from( treeList.querySelectorAll( 'details' ) );
};

const runFilter = () => {
  const treeList = document.getElementById( 'treeList' );
  const query = document.getElementById( 'treeFilter' ).value.trim().toLowerCase();
  const btnFilterClear = document.getElementById( 'btnFilterClear' );
  const normalizedQuery = query.replace( /[-\s]+/g, ' ' );
  btnFilterClear.style.display = query ? 'block' : 'none';

  const items = cachedTreeItems;
  const folders = cachedTreeFolders;

  if ( !query ) {
    treeList.classList.remove( 'filtering' );
    if ( treeSummaryText ) document.getElementById( 'hFiles' ).textContent = treeSummaryText;
    items.forEach( ( el ) => el.classList.remove( 'is-hidden' ) );
    folders.forEach( ( el ) => el.classList.remove( 'is-hidden' ) );
    if ( preFilterOpenState ) {
      folders.forEach( ( details ) => {
        const key = details.dataset.folderPath;
        if ( preFilterOpenState.has( key ) ) details.open = preFilterOpenState.get( key );
      } );
      preFilterOpenState = null;
    }
    return;
  }

  if ( preFilterOpenState === null ) {
    preFilterOpenState = new Map();
    folders.forEach( ( details ) => preFilterOpenState.set( details.dataset.folderPath, details.open ) );
  }

  let matchCount = 0;
  items.forEach( ( el ) => {
    const name = ( el.dataset.path || '' ).split( '/' ).pop().toLowerCase();
    const normalizedName = name.replace( /[-\s]+/g, ' ' );
    const matches = name.includes( query ) || normalizedName.includes( normalizedQuery );
    el.classList.toggle( 'is-hidden', !matches );
    if ( matches ) matchCount++;
  } );

  folders.slice().reverse().forEach( ( details ) => {
    const hasVisible = details.querySelector( '.tree-item:not(.is-hidden)' );
    if ( hasVisible ) { details.classList.remove( 'is-hidden' ); details.open = true; }
    else { details.classList.add( 'is-hidden' ); }
  } );

  treeList.classList.add( 'filtering' );
  document.getElementById( 'hFiles' ).textContent =
    `${ matchCount.toLocaleString() } match${ matchCount === 1 ? '' : 'es' }`;
};

/* ── debounce ── */
const debounce = ( fn, ms ) => {
  let timer;
  return ( ...args ) => { clearTimeout( timer ); timer = setTimeout( () => fn( ...args ), ms ); };
};

/* ── expand/collapse all ── */
const setupExpandAll = () => {
  const btn = document.getElementById( 'btnExpandAll' );
  btn.addEventListener( 'click', () => {
    const allDetails = document.getElementById( 'treeList' ).querySelectorAll( 'details' );
    const expand = btn.textContent.trim() !== '⊟';
    allDetails.forEach( ( d ) => { d.open = expand; } );
    setExpandAllButton( expand );
  } );
};

/* ── selection: hand off to Content (reference §26) ── */
const setupFileSelection = () => {
  document.getElementById( 'treeList' ).addEventListener( 'click', ( e ) => {
    const target = e.target.closest( '[data-action="select-file"]' );
    if ( !target ) return;
    selectFile( target.dataset.path );   // Content owns currentFilePath
  } );
};

/* ── fetchTree: load the repo tree from GitHub (writes state.tree) ── */
const fetchTree = async () => {
  const signal = newAbort();
  const treeList = document.getElementById( 'treeList' );
  treeList.innerHTML = '<p style="padding:0.5rem;">Loading tree…</p>';
  try {
    if ( !state.branch ) state.branch = await getDefaultBranch( signal );
    const data = await ghApi( `https://api.github.com/repos/${ encodeURIComponent( state.owner ) }/${ encodeURIComponent( state.repo ) }/git/trees/${ encodeURIComponent( state.branch ) }?recursive=1`, signal );
    const count = data.tree?.length || 0;
    if ( data.truncated || count > CONFIG.maxRepoFiles ) {
      state.tree = null;
      treeList.innerHTML = `<p style="padding:0.5rem;color:red;">Repo too large for the lab (${ count.toLocaleString() } entries).</p>`;
      return;
    }
    state.tree = data.tree;
    renderTree( state.tree );

    // Sidebar summary: 📁 folders · 📄 files · size (matches what renders).
    const hidF = hiddenFolderSet(), hidf = hiddenFileSet();
    const vis = state.tree.filter( ( i ) => isVisibleTreeItem( i, hidF, hidf ) );
    const folders = vis.filter( ( i ) => i.type === 'tree' ).length;
    const files = vis.filter( ( i ) => i.type === 'blob' ).length;
    const bytes = vis.reduce( ( s, i ) => s + ( i.type === 'blob' ? ( i.size || 0 ) : 0 ), 0 );
    const h = document.getElementById( 'hFiles' );
    h.textContent = `📁 ${ folders.toLocaleString() } · 📄 ${ files.toLocaleString() } · ${ formatFileSize( bytes ) }`;
    treeSummaryText = h.textContent;
  } catch ( err ) {
    treeList.innerHTML = `<p style="padding:0.5rem;color:red;">${ escapeHTML( err.message ) }</p>`;
  }
};

/* ── pick the root README on first load ── */
const autoSelectReadme = () => {
  if ( !state.tree ) return;
  const readme = state.tree.find( ( i ) => i.type === 'blob' && !i.path.includes( '/' ) && /^readme/i.test( i.path ) );
  if ( readme ) selectFile( readme.path );
};

/* ── init: render + wire ── */
const initSidebar = () => {
  if ( state.tree ) renderTree( state.tree );
  treeSummaryText = document.getElementById( 'hFiles' ).textContent;
  const filter = document.getElementById( 'treeFilter' );
  filter.addEventListener( 'input', debounce( runFilter, 120 ) );
  document.getElementById( 'btnFilterClear' ).addEventListener( 'click', () => {
    filter.value = ''; runFilter(); filter.focus();
  } );
  setupExpandAll();
  setupFileSelection();
  const exp = document.getElementById( 'btnExpandAll' );
  if ( exp ) exp.style.display = '';

  // Sidebar footer brand mark + scroll-to-top.
  const footImg = document.querySelector( '#btnScrollTreeTop img' );
  if ( footImg && !footImg.getAttribute( 'src' ) ) {
    footImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%232563eb'/%3E%3Cg font-family='system-ui,sans-serif' font-size='30' font-weight='700' fill='white' text-anchor='middle' dominant-baseline='middle'%3E%3Ctext x='22' y='28'%3ET%3C/text%3E%3Ctext x='42' y='40'%3ET%3C/text%3E%3C/g%3E%3C/svg%3E";
  }
  document.getElementById( 'btnScrollTreeTop' )?.addEventListener( 'click', () =>
    document.getElementById( 'treeList' ).scrollTo( { top: 0, behavior: 'smooth' } ) );

  // Resizer drag (real app does this in setupListeners; minimal version here).
  const resizer = document.getElementById( 'resizer' );
  if ( resizer ) {
    let dragging = false;
    resizer.addEventListener( 'pointerdown', ( e ) => { dragging = true; resizer.classList.add( 'dragging' ); resizer.setPointerCapture( e.pointerId ); } );
    resizer.addEventListener( 'pointermove', ( e ) => { if ( dragging ) document.documentElement.style.setProperty( '--sidebar-width', Math.min( 600, Math.max( 150, e.clientX ) ) + 'px' ); } );
    resizer.addEventListener( 'pointerup', () => { dragging = false; resizer.classList.remove( 'dragging' ); } );
  }
};
