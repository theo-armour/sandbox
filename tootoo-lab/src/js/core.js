/* TooToo Lab — core.js  (shared services, no DOM, no UI).
   In the real app these live in the core layer (reference §1, §15, §16, §18-helpers).
   Only the helpers the carved components need are here for now; this file grows
   as we carve. Per ARCHITECTURE.md, core is the single owner of CONFIG + state
   and the shared utilities every component reads. */

/* ── CONFIG + state (core OWNS these; populated by config.js for the assembled
   live build, or by mock-data.js for the offline standalone component pages) ── */
const CONFIG = {
  owner: '', repo: '', branch: '',
  appName: 'TooToo', subtitle: '', themeColor: '#2563eb',
  sourceRepoUrl: 'https://github.com/pushme-pullyou/tootoo',
  storagePrefix: 'tootoo',
  hiddenFolders: [ 'Images' ], hiddenFiles: [], maxRepoFiles: 5000,
};
const state = { owner: '', repo: '', branch: '', tree: null, currentFilePath: '' };

/* ── escape for safe innerHTML ── */
const escapeHTML = ( s ) =>
  String( s ).replace( /[&<>"']/g, ( c ) =>
    ( { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ c ] ) );

/* ── folder/file display name: hyphens shown as spaces ── */
const displayTreeName = ( name ) => name.replace( /-/g, ' ' );

/* ── file type icons ── */
const getFileIcon = ( fileName ) => {
  const ext = fileName.includes( '.' ) ? '.' + fileName.split( '.' ).pop().toLowerCase() : '';
  const iconMap = {
    '.md': '📝',
    '.js': '🟨', '.mjs': '🟨', '.cjs': '🟨',
    '.ts': '🟦', '.tsx': '🟦',
    '.py': '🐍',
    '.html': '🌐', '.htm': '🌐',
    '.css': '🎨', '.scss': '🎨', '.less': '🎨',
    '.png': '🖼️', '.jpg': '🖼️', '.jpeg': '🖼️', '.gif': '🖼️', '.webp': '🖼️', '.svg': '🖼️', '.ico': '🖼️',
    '.mp3': '🎵', '.wav': '🎵', '.ogg': '🎵',
    '.mp4': '🎬', '.webm': '🎬',
    '.pdf': '📕',
    '.xlsx': '📊', '.xls': '📊', '.csv': '📊', '.ods': '📊',
    '.yaml': '⚙️', '.yml': '⚙️', '.toml': '⚙️',
    '.zip': '📦', '.tar': '📦', '.gz': '📦', '.7z': '📦',
    '.json': '{ }',
  };
  return iconMap[ ext ] || '📄';
};

/* ── human file size ── */
const formatFileSize = ( bytes ) => {
  if ( bytes == null ) return '';
  if ( bytes < 1024 ) return `${ bytes } B`;
  if ( bytes < 1024 * 1024 ) return `${ ( bytes / 1024 ).toFixed( 1 ) } KB`;
  return `${ ( bytes / ( 1024 * 1024 ) ).toFixed( 1 ) } MB`;
};

/* ── hidden-from-tree config (CONFIG.hiddenFolders / hiddenFiles) ── */
const hiddenFolderSet = () => new Set( ( CONFIG.hiddenFolders || [] ).map( ( s ) => s.toLowerCase() ) );
const hiddenFileSet = () => new Set( ( CONFIG.hiddenFiles || [] ).map( ( s ) => s.toLowerCase() ) );

/* Dotfiles/dotfolders and CONFIG-hidden names are dropped from the sidebar. */
const isVisibleTreeItem = ( item, folders, files ) => {
  const parts = item.path.split( '/' );
  if ( parts.some( ( p ) => p.startsWith( '.' ) || folders.has( p.toLowerCase() ) ) ) return false;
  return !( item.type === 'blob' && files.has( parts[ parts.length - 1 ].toLowerCase() ) );
};

/* ── extension constants (reference §3) — used by the content file-header ── */
const IMAGE_EXTS = [ 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico' ];
const AUDIO_EXTS = [ 'mp3', 'wav', 'ogg' ];
const VIDEO_EXTS = [ 'mp4', 'webm' ];
const SHEET_EXTS = [ 'xlsx', 'xls', 'csv', 'ods' ];
const STREAMABLE_EXTS = [ ...IMAGE_EXTS, ...AUDIO_EXTS, ...VIDEO_EXTS, 'pdf' ];
const NO_COPY_EXTS = [ ...STREAMABLE_EXTS, ...SHEET_EXTS ];
const TAB_VIEWABLE_EXTS = [
  'html', 'htm', 'pdf', 'txt', 'text', 'md', 'markdown',
  ...IMAGE_EXTS, ...AUDIO_EXTS, ...VIDEO_EXTS,
  'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'css', 'scss', 'less',
  'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'env',
  'py', 'rb', 'go', 'rs', 'java', 'kt', 'c', 'h', 'cpp', 'cc', 'hpp',
  'cs', 'php', 'sh', 'bash', 'zsh', 'sql', 'pl', 'lua', 'r', 'swift', 'log',
];
const isDownloadAction = ( ext ) => !TAB_VIEWABLE_EXTS.includes( ext );
const isTextOpenAsPlain = ( ext ) =>
  !ext || [ 'md', 'markdown', 'mkd', 'mkdn', 'obj', 'stl', 'mtl' ].includes( ext );

/* ── encode an in-repo path for a URL (keep the slashes) ── */
const encodePath = ( p ) => p.split( '/' ).map( encodeURIComponent ).join( '/' );

/* ── blob URL (real app tracks + revokes these; lab keeps it simple) ── */
const createBlobUrl = ( blob ) => URL.createObjectURL( blob );

/* ── GitHub mark, for the content file-header link ── */
const GITHUB_SVG_ICON =
  `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>`;

/* ── per-extension Rendered/Raw preference (reference §7) ── */
const viewPrefKey = ( ext ) => `${ CONFIG.storagePrefix || 'tootoo' }-lab:viewPref:${ ext }`;
const getPreferredView = ( ext ) => {
  try { return localStorage.getItem( viewPrefKey( ext ) ) || 'rendered'; } catch ( _ ) { return 'rendered'; }
};
const setPreferredView = ( ext, view ) => {
  try { localStorage.setItem( viewPrefKey( ext ), view ); } catch ( _ ) { /* storage disabled */ }
};

/* ===================================================================
   DATA LAYER  (carved 2026-06-21) — GitHub services + repo detection.
   Simplified vs the reference: query-param/CONFIG repo detection (no
   .git/config probe), raw.githubusercontent for files (no API blob
   fetch / no local mode), no token UI. Enough for a live public-repo viewer.
   =================================================================== */

/* ── request abort (cancel in-flight fetch when navigating away) ── */
let currentAbortController = null;
const newAbort = () => {
  if ( currentAbortController ) currentAbortController.abort();
  currentAbortController = new AbortController();
  return currentAbortController.signal;
};

/* ── in-memory file-text cache (per session; capped, FIFO eviction) ── */
const fileTextCache = new Map();
const cacheKey = ( path ) => `${ state.owner }/${ state.repo }/${ state.branch }/${ path }`;
const cachePut = ( key, text ) => {
  fileTextCache.set( key, text );
  if ( fileTextCache.size > 50 ) fileTextCache.delete( fileTextCache.keys().next().value );
};
const clearFileCache = () => fileTextCache.clear();

/* ── GitHub token (optional, from localStorage) ── */
const tokenStorageKey = () => `${ CONFIG.storagePrefix }-lab:token`;
const getToken = () => {
  try { return localStorage.getItem( tokenStorageKey() ) || ''; } catch ( _ ) { return ''; }
};
const ghHeaders = () => {
  const h = { Accept: 'application/vnd.github+json' };
  const t = getToken();
  if ( t ) h.Authorization = `token ${ t }`;
  return h;
};

/* ── live API rate badge ── */
const updateRateBadge = ( res ) => {
  const remaining = res.headers.get( 'X-RateLimit-Remaining' );
  const limit = res.headers.get( 'X-RateLimit-Limit' );
  const badge = document.getElementById( 'rateBadge' );
  if ( remaining === null || !badge ) return;
  const tokenBtn = document.getElementById( 'btnToken' );
  if ( tokenBtn ) tokenBtn.title = `${ remaining }/${ limit } GitHub API requests left this hour`;
  badge.textContent = `${ remaining } / ${ limit }`;
  badge.style.display = 'inline-block';
};

/* ── GitHub REST call (JSON) ── */
const ghApi = async ( url, signal ) => {
  const res = await fetch( url, { headers: ghHeaders(), signal } );
  updateRateBadge( res );
  if ( res.status === 403 ) throw new Error( 'Rate limited. Add a GitHub token for higher limits.' );
  if ( res.status === 404 ) throw new Error( 'Not found (private repo, or wrong owner/repo/branch).' );
  if ( !res.ok ) throw new Error( `GitHub API error: ${ res.status }` );
  return res.json();
};

/* ── raw file URL + fetchers ── */
const rawUrl = ( path ) =>
  `https://raw.githubusercontent.com/${ state.owner }/${ state.repo }/${ state.branch }/${ encodePath( path ) }`;

/* Fetch a file's Response — local-first (file:// drop-in) then raw GitHub. */
const fetchFileResponse = async ( path, signal ) => {
  const local = localUrlFor( path );
  if ( local ) {
    try { const r = await fetch( local, { signal } ); if ( r.ok ) return r; }
    catch ( e ) { if ( e.name === 'AbortError' ) throw e; /* fall through to GitHub */ }
  }
  const res = await fetch( rawUrl( path ), { signal } );
  if ( !res.ok ) throw new Error( `Failed to load ${ path }: ${ res.status }` );
  return res;
};

const fetchFileText = async ( path, signal ) => {
  // Offline standalone pages define mockFiles; never hit the network there.
  if ( typeof mockFiles !== 'undefined' ) {
    if ( mockFiles[ path ] != null ) return mockFiles[ path ];
    throw new Error( `File not found: ${ path }` );
  }
  const key = cacheKey( path );
  if ( fileTextCache.has( key ) ) return fileTextCache.get( key );
  const text = await ( await fetchFileResponse( path, signal ) ).text();
  cachePut( key, text );
  return text;
};

const resolveMediaUrl = ( path ) => localUrlFor( path ) || rawUrl( path );

/* ── binary fetch for media / spreadsheets, with correct MIME for inline view
   (raw.githubusercontent serves octet-stream, which the browser would download;
   re-wrapping the blob with the right type lets <audio>/<video>/<iframe> play). ── */
const MIME = {
  wav: 'audio/wav', mp3: 'audio/mpeg', ogg: 'audio/ogg',
  mp4: 'video/mp4', webm: 'video/webm', pdf: 'application/pdf',
};
const fetchFileBlob = async ( path, mime, signal ) => {
  let blob = await ( await fetchFileResponse( path, signal ) ).blob();
  if ( mime ) blob = new Blob( [ blob ], { type: mime } );
  return createBlobUrl( blob );
};
const fetchFileArrayBuffer = async ( path, signal ) =>
  new Uint8Array( await ( await fetchFileResponse( path, signal ) ).arrayBuffer() );

/* ── local file:// mode (drop-in next to a checkout) ──
   ⚠️ UNVERIFIED in this sandbox. Assumes the app sits at the repo ROOT, so files
   are siblings ('./path') and .git/config is './.git/config'. The tree still
   comes from the GitHub API (a directory can't be enumerated over file://); local
   mode just sources FILE CONTENTS from disk and seeds owner/repo from .git/config. ── */
let localMode = false;
const detectLocalMode = async () => {
  if ( location.protocol !== 'file:' ) return;
  try {
    const res = await fetch( '.git/config' );
    if ( !res.ok ) return;
    const text = await res.text();
    const m = text.match( /github\.com[:/]([^/\s]+)\/([^/\s.]+)(?:\.git)?/i );
    if ( m ) { CONFIG.owner = CONFIG.owner || m[ 1 ]; CONFIG.repo = CONFIG.repo || m[ 2 ]; }
    localMode = true;
  } catch ( _ ) { /* no readable .git/config — stay remote */ }
};
const localUrlFor = ( path ) => ( localMode ? './' + encodePath( path ) : null );

/* ── repo detection: ?owner=&repo=&branch=  →  CONFIG defaults ── */
const detectRepo = () => {
  const p = new URLSearchParams( location.search );
  state.owner = p.get( 'owner' ) || CONFIG.owner || '';
  state.repo = p.get( 'repo' ) || CONFIG.repo || '';
  state.branch = p.get( 'branch' ) || CONFIG.branch || '';
};

const getDefaultBranch = async ( signal ) => {
  const data = await ghApi( `https://api.github.com/repos/${ encodeURIComponent( state.owner ) }/${ encodeURIComponent( state.repo ) }`, signal );
  return data.default_branch;
};

/* ── hash routing ── */
const updateHash = ( path ) => { try { history.replaceState( null, '', '#' + encodePath( path ) ); } catch ( _ ) { /* noop */ } };
const currentHashPath = () => { try { return decodeURIComponent( location.hash.replace( /^#/, '' ) ); } catch ( _ ) { return ''; } };
