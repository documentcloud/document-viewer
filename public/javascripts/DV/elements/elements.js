/**
 * @member DV.Schema
 * @property {Array} elements
 * We cache DOM references to improve speed and reduce DOM queries
 */
DV.Schema.elements =
[
  { name: 'browserDocument',    query: document },
  { name: 'browserWindow',      query: window },
  { name: 'header',             query: 'div.DV-header'},
  { name: 'viewer',             query: 'div.DV-docViewer'},
  { name: 'window',             query: 'div.DV-pages'},
  { name: 'sets',               query: 'div.DV-set'},
  { name: 'pages',              query: 'div.DV-page'},
  { name: 'metas',              query: 'div.DV-pageMeta'},
  { name: 'bar',                query: 'div.DV-bar'},
  { name: 'currentPage',        query: 'span.DV-currentPage'},
  { name: 'well',               query: 'div.DV-well'},
  { name: 'collection',         query: 'div.DV-pageCollection'},
  { name: 'annotations',        query: 'div.DV-allAnnotations'},
  { name: 'navigation',         query: 'div.DV-navigation' },
  { name: 'chaptersContainer',  query: 'div.DV-chaptersContainer' },
  { name: 'searchInput',        query: 'input.DV-searchInput' },
  { name: 'textCurrentPage',    query: 'span.DV-textCurrentPage' },
  { name: 'coverPages',         query: 'div.DV-cover' },
  { name: 'fullscreen',         query: 'div.DV-fullscreen' }
];