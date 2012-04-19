/**
 * @class DV.History
 * Handles JavaScript history management and callbacks. To use, register a
 * regexp that matches the history hash with its corresponding callback:
 *
 * `dc.history.register(/^#search/, controller.runSearch);`
 *
 * And then you can save arbitrary history fragments.
 *
 * `dc.history.save('search/freedom/p3');`
 *
 * Initialize history with an empty set of handlers.
 * Bind to the HTML5 'onhashchange' callback, if it exists. Otherwise,
 * start polling the window location.
 */
DV.History = function(viewer) {
  this.viewer = viewer;

  // Ensure we don't accidentally bind to history twice.
  DV.History.count++;

  // The interval at which the window location is polled.
  this.URL_CHECK_INTERVAL = 500;

  // We need to use an iFrame to save history if we're in an old version of IE.
  this.USE_IFRAME = DV.jQuery.browser.msie && DV.jQuery.browser.version < 8;

  // The ordered list of history handlers matchers and callbacks.
  this.handlers = [];
  this.defaultCallback = null;

  // The current recorded window.location.hash.
  this.hash = window.location.hash;

  _.bindAll(this, 'checkURL');
  if (DV.History.count > 1) return;

  // Wait until the window loads.
  DV.jQuery(_.bind(function() {
    if (this.USE_IFRAME) this.iframe = DV.jQuery('<iframe src="javascript:0"/>').hide().appendTo('body')[0].contentWindow;
    if ('onhashchange' in window) {
      window.onhashchange = this.checkURL;
    } else {
      setInterval(this.checkURL, this.URL_CHECK_INTERVAL);
    }
  }, this));
};

/**
 * @property {Number} [count="0"]
 * @static
 */
DV.History.count = 0;

DV.History.prototype = {

  /**
   * @method register
   * Register a history handler. Pass a regular expression that can be used to
   * match your URLs, and the callback to be invoked with the remainder of the
   * hash, when matched.
   *
   * @param {String} matcher
   * @param {Function} callback
   */
  register : function(matcher, callback) {
    this.handlers.push({matcher : matcher, callback : callback});
  },

  /**
   * @method save
   * Save a moment into browser history. Make sure you've registered a handler
   * for it. You're responsible for pre-escaping the URL fragment.
   *
   * @param  {Object} hash
   */
  save : function(hash) {
    if (DV.History.count > 1) return;
    window.location.hash = this.hash = (hash ? '#' + hash : '');
    if (this.USE_IFRAME && (this.iframe && (this.hash != this.iframe.location.hash))) {
      this.iframe.document.open().close();
      this.iframe.location.hash = this.hash;
    }
  },

  /**
   * @method checkURL
   * Check the current URL hash against the recorded one, firing callbacks.
   */
  checkURL : function() {
    if (DV.History.count > 1) return;
    try {
      var current = (this.USE_IFRAME ? this.iframe : window).location.hash;
    } catch (err) {
      // IE iframe madness.
    }
    if (!current ||
      current == this.hash ||
      '#' + current == this.hash ||
      current == decodeURIComponent(this.hash)) return false;
    if (this.USE_IFRAME) window.location.hash = current;
    this.loadURL(true);
  },

  /**
   * @method loadURL
   * Load the history callback associated with the current page fragment. On
   * pages that support history, this method should be called at page load,
   * after all the history callbacks have been registered.
   * executeCallbacks must be passed as true, otherwise true/false will returned based on positive route matches.
   *
   * @param  {Boolean} executeCallbacks
   * @return {Boolean}
   */
  loadURL : function(executeCallbacks) {
    var hash = this.hash = window.location.hash;

    // go through matches in reverse order so that oldest rules are executed last
    for(var i = this.handlers.length-1; i >= 0; i--){
      var match = hash.match(this.handlers[i].matcher);
      if (match) {
        if(executeCallbacks === true){
          this.handlers[i].callback.apply(this.handlers[i].callback,match.slice(1,match.length));
        }
        return true;
      }
    }
    if(this.defaultCallback != null && executeCallbacks === true){
      this.defaultCallback();
    }else{
      return false;
    }
  }

};
