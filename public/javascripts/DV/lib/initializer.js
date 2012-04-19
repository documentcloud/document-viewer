// Fake out console.log for safety, if it doesn't exist.
window.console || (window.console = {});
console.log    || (console.log = _.identity);

/**
 *	@class  DV
 *	Create the DV namespace.
 */
// Create the DV namespaces.
window.DV   = window.DV   || {};
/**
 * @property {Function} jQuery
 * Wrap jQuery in DV namespace. jQuery namespace.
 * @static
 */
DV.jQuery   = jQuery.noConflict(true);
/**
 * @property {Object} viewers
 * Holds instances of viewers. viewers namespace.
 * @static
 */
DV.viewers  = DV.viewers  || {};
/**
 * @property {Object} model
 * model namespace.
 * @static
 */
DV.model    = DV.model    || {};

