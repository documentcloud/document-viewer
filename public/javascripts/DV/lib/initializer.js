// Fake out console.log for safety, if it doesn't exist.
window.console || (window.console = {});
console.log    || (console.log = _.identity);

// Create the DV namespaces.
window.DV   = window.DV   || {};
DV.jQuery   = jQuery.noConflict(true);
DV._        = _.noConflict(); // preserve a safe reference for the viewer
DV.viewers  = DV.viewers  || {};
DV.model    = DV.model    || {};

