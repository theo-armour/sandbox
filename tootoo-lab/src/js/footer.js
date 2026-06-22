/* TooToo Lab — footer.js  (the branding / identity component).
   Reads: CONFIG (appName, sourceRepoUrl, faviconColor). A new page-level footer
   the single-file app doesn't have yet — the component model makes it cheap. */

const renderFooter = () => {
  const brand = document.getElementById( 'footerBrand' );
  if ( brand ) {
    const src = CONFIG.sourceRepoUrl || '#';
    brand.innerHTML =
      `<strong>${ escapeHTML( CONFIG.appName ) }</strong> · single-file GitHub repository browser · ` +
      `<a href="${ escapeHTML( src ) }" target="_blank" rel="noopener">source</a>`;
  }
  const mark = document.querySelector( '.app-footer-mark' );
  if ( mark && !mark.getAttribute( 'src' ) ) {
    mark.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%232563eb'/%3E%3Cg font-family='system-ui,sans-serif' font-size='30' font-weight='700' fill='white' text-anchor='middle' dominant-baseline='middle'%3E%3Ctext x='22' y='28'%3ET%3C/text%3E%3Ctext x='42' y='40'%3ET%3C/text%3E%3C/g%3E%3C/svg%3E";
  }
};
