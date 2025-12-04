document.addEventListener( 'DOMContentLoaded', () => {
  const treeContainer = document.getElementById( 'treeContainer' );
  const exportBtn = document.getElementById( 'exportBtn' );
  const statusDiv = document.getElementById( 'status' );
  let selectedFolderId = null;

  // 1. Load all bookmark folders
  chrome.bookmarks.getTree( ( bookmarkTreeNodes ) => {
    treeContainer.innerHTML = ''; // Clear loading message

    // We usually want to skip the root '0' node and show its children (Bookmarks Bar, Other, Mobile)
    // The root node usually has children[0] as 'Bookmarks Bar', children[1] as 'Other Bookmarks'
    const rootChildren = bookmarkTreeNodes[ 0 ].children;

    for ( const node of rootChildren ) {
      treeContainer.appendChild( createNodeElement( node ) );
    }
  } );

  function createNodeElement ( node ) {
    // Filter children to only include folders
    const folderChildren = node.children ? node.children.filter( child => !child.url && child.children ) : [];

    const details = document.createElement( 'details' );
    const summary = document.createElement( 'summary' );

    summary.textContent = node.title;
    summary.dataset.id = node.id;

    // Click handler for selection
    summary.addEventListener( 'click', ( e ) => {
      e.preventDefault(); // Prevent toggle if we just want to select?
      // Actually standard behavior is click to toggle.
      // Let's make it: Click text to select, Click arrow (or double click) to toggle?
      // Simpler: Click selects AND toggles.

      // Clear previous selection
      document.querySelectorAll( 'summary.selected' ).forEach( el => el.classList.remove( 'selected' ) );

      // Select this one
      summary.classList.add( 'selected' );
      selectedFolderId = node.id;
      exportBtn.disabled = false;

      // Toggle open/close manually since we prevented default
      if ( details.hasAttribute( 'open' ) ) {
        details.removeAttribute( 'open' );
      } else {
        details.setAttribute( 'open', '' );
      }
    } );

    details.appendChild( summary );

    if ( folderChildren.length > 0 ) {
      // Recursively add children
      for ( const child of folderChildren ) {
        details.appendChild( createNodeElement( child ) );
      }
    } else {
      // No sub-folders
      details.classList.add( 'empty' );
    }

    // Default closed (collapsed) is standard for <details> unless 'open' attribute is added.
    // So we don't need to do anything to keep them closed.

    return details;
  }

  // 2. Handle Export
  exportBtn.addEventListener( 'click', () => {
    if ( !selectedFolderId ) return;

    statusDiv.textContent = "Generating HTML...";

    chrome.bookmarks.getSubTree( selectedFolderId, ( results ) => {
      if ( !results || !results.length ) {
        statusDiv.textContent = "Error: Folder not found.";
        return;
      }

      const rootNode = results[ 0 ];
      const htmlContent = generateNetscapeHTML( rootNode );
      downloadFile( htmlContent, `bookmarks_${ rootNode.title.replace( /[^a-z0-9]/gi, '_' ) }.html` );
      statusDiv.textContent = "Export complete!";
    } );
  } );
} );

// --- Helper: Generate Netscape HTML ---
function generateNetscapeHTML ( rootNode ) {
  const title = escapeHtml( rootNode.title ) || 'Bookmarks';
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>${ title }</TITLE>
<H1>${ title }</H1>
<DL><p>
`;

  // If the selected node is a folder, traverse its children.
  // If we want to include the selected folder itself as a header, we can wrap it.
  // Standard export usually lists the contents. Let's list the contents of the selected folder.
  if ( rootNode.children ) {
    html += traverseNodes( rootNode.children );
  }

  html += `</DL><p>`;
  return html;
}

function traverseNodes ( nodes ) {
  let html = '';
  for ( const node of nodes ) {
    if ( node.url ) {
      // It's a bookmark
      const date = node.dateAdded ? Math.floor( node.dateAdded / 1000 ) : 0;
      html += `    <DT><A HREF="${ node.url }" ADD_DATE="${ date }">${ escapeHtml( node.title ) }</A>\n`;
    } else if ( node.children ) {
      // It's a folder
      const date = node.dateAdded ? Math.floor( node.dateAdded / 1000 ) : 0;
      const lastModified = node.dateGroupModified ? Math.floor( node.dateGroupModified / 1000 ) : 0;
      html += `    <DT><H3 ADD_DATE="${ date }" LAST_MODIFIED="${ lastModified }">${ escapeHtml( node.title ) }</H3>\n`;
      html += `    <DL><p>\n`;
      html += traverseNodes( node.children );
      html += `    </DL><p>\n`;
    }
  }
  return html;
}

function escapeHtml ( text ) {
  if ( !text ) return '';
  return text
    .replace( /&/g, "&amp;" )
    .replace( /</g, "&lt;" )
    .replace( />/g, "&gt;" )
    .replace( /"/g, "&quot;" )
    .replace( /'/g, "&#039;" );
}

// --- Helper: Trigger Download ---
function downloadFile ( content, filename ) {
  const blob = new Blob( [ content ], { type: 'text/html' } );
  const url = URL.createObjectURL( blob );
  const a = document.createElement( 'a' );
  a.href = url;
  a.download = filename;
  document.body.appendChild( a );
  a.click();
  document.body.removeChild( a );
  URL.revokeObjectURL( url );
}
