// Fake out console.log for safety, if it doesn't exist.
window.console || (window.console = {});
console.log    || (console.log = _.identity);

// Create the DV namespaces.
/*
	Namespace: DV

	Top level namespace for document viewer.
*/
window.DV   = window.DV   || {};
/*
	Namespace: DV.jQuery

	Wraps jQuery into DV and removes jQuery from global namespace.
*/
DV.jQuery   = jQuery.noConflict(true);
/*
	Namespace: DV.viewers

	Holds instances of document viewers
*/
DV.viewers  = DV.viewers  || {};
/*
	Namespace: DV.model

	Namespace for models.
*/
DV.model    = DV.model    || {};

