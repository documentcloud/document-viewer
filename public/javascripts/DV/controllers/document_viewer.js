/**
 * @class DV.DocumentViewer
 * The main Document Viewer controller class. Handles the application logic for
 * instantiating a Document Viewer.
 */
/**
 * @method  constructor
 * Constructor function.
 * @param  {Object}  options 2nd class arguments
 */
DV.DocumentViewer = function(options) {
  this.options        = options;
  this.window         = window;
  this.$              = this.jQuery;
  this.schema         = new DV.Schema();
  this.api            = new DV.Api(this);
  this.history        = new DV.History(this);

  // Build the data models
  this.models     = this.schema.models;
  this.events     = _.extend({}, DV.Schema.events);
  this.helpers    = _.extend({}, DV.Schema.helpers);
  this.states     = _.extend({}, DV.Schema.states);

  // state values
  this.isFocus            = true;
  this.openEditor         = null;
  this.confirmStateChange = null;
  this.activeElement      = null;
  this.observers          = [];
  this.windowDimensions   = {};
  this.scrollPosition     = null;
  this.checkTimer         = {};
  this.busy               = false;
  this.annotationToLoadId = null;
  this.dragReporter       = null;
  this.compiled           = {};
  this.tracker            = {};

  this.onStateChangeCallbacks = [];

  this.events     = _.extend(this.events, {
    viewer      : this,
    states      : this.states,
    elements    : this.elements,
    helpers     : this.helpers,
    models      : this.models,

    // this allows us to bind events to call the method corresponding to the current state
    compile     : function(){
      var a           = this.viewer;
      var methodName  = arguments[0];
      return function(){
        if(!a.events[a.state][methodName]){
          a.events[methodName].apply(a.events,arguments);
        }else{
          a.events[a.state][methodName].apply(a.events,arguments);
        }
      };
    }
  });

  this.helpers  = _.extend(this.helpers, {
    viewer      : this,
    states      : this.states,
    elements    : this.elements,
    events      : this.events,
    models      : this.models
  });

  this.states   = _.extend(this.states, {
    viewer      : this,
    helpers     : this.helpers,
    elements    : this.elements,
    events      : this.events,
    models      : this.models
  });
};

/**
 * @method  loadModels
 * Instantiates all models needed by a Document Viewer.
 *
 * Models instantiated include...
 *
 * - chapters
 * - document
 * - pages
 * - annotations
 * - removedPages
 */
DV.DocumentViewer.prototype.loadModels = function() {
  this.models.chapters     = new DV.model.Chapters(this);
  this.models.document     = new DV.model.Document(this);
  this.models.pages        = new DV.model.Pages(this);
  this.models.annotations  = new DV.model.Annotations(this);
  this.models.removedPages = {};
};

/**
 * @method  open
 * Transition to a given state... unless we're already in it.
 *
 * @param {String} state State proposed for opening.
 */
DV.DocumentViewer.prototype.open = function(state) {
  if (this.state == state) return;
  var continuation = _.bind(function() {
    this.state = state;
    this.states[state].apply(this, arguments);
    this.slapIE();
    this.notifyChangedState();
    return true;
  }, this);
  this.confirmStateChange ? this.confirmStateChange(continuation) : continuation();
};

/**
 * @method  slapIE
 * IE zoom hack
 */
DV.DocumentViewer.prototype.slapIE = function() {
  DV.jQuery(this.options.container).css({zoom: 0.99}).css({zoom: 1});
};

/**
 * @method  notifyChangedState
 * Call subscribers on state change.
 */
DV.DocumentViewer.prototype.notifyChangedState = function() {
  _.each(this.onStateChangeCallbacks, function(c) { c(); });
};

/**
 * @method  recordHit
 * Record a hit on this document viewer.
 *
 * @param  {String}  hitUrl Url to record hit on
 */
DV.DocumentViewer.prototype.recordHit = function(hitUrl) {
  var loc = window.location;
  var url = loc.protocol + '//' + loc.host + loc.pathname;
  if (url.match(/^file:/)) return false;
  url = url.replace(/[\/]+$/, '');
  var id   = parseInt(this.api.getId(), 10);
  var key  = encodeURIComponent('document:' + id + ':' + url);
  DV.jQuery(document.body).append('<img alt="" width="1" height="1" src="' + hitUrl + '?key=' + key + '" />');
};

/**
 * @method jQuery
 * jQuery object, scoped to this viewer's container.
 *
 * @param  {String}   selector css selector
 * @param  {Object}   context object context to call jQuery with (e.g. this)
 * @return {Function}
 */
DV.DocumentViewer.prototype.jQuery = function(selector, context) {
  context = context || this.options.container;
  return DV.jQuery.call(DV.jQuery, selector, context);
};

/**
 * @method load
 * The origin function, kicking off the entire documentViewer render.
 *
 * @static
 * @param  {String}  documentRep url to a json document or an object
 * @param  {Object}  options     2nd level arguments
 *
 * @return  {Object}  instance of viewer
 */
/**
 * @cfg  options  object containing optional arguments
 * @cfg  options.container  css selector for container element
 * @cfg  options.showSidebar  displays or hides sidebar
 * @cfg  options.zoom  default zoom level
 * @cfg  options.width  width of document viewer in pixels
 * @cfg  options.height  height of document viewer in pixels
 * @cfg  options.afterLoad  callback for afterLoad event
 * @cfg  options.search  hide or display search input
 * @cfg  options.templates  url where templates need to be loaded from
 * @cfg  options.showAnnotations  hide or display annotations
 * @cfg  options.pdf  hide or show pdf link
 * @cfg  options.text  hide or show text tab for document
 */
DV.load = function(documentRep, options) {
  options = options || {};
  var id  = documentRep.id || documentRep.match(/([^\/]+)(\.js|\.json)$/)[1];
  if ('showSidebar' in options) options.sidebar = options.showSidebar;
  var defaults = {
    container : document.body,
    zoom      : 'auto',
    sidebar   : true
  };
  options            = _.extend({}, defaults, options);
  options.fixedSize  = !!(options.width || options.height);
  var viewer         = new DV.DocumentViewer(options);
  DV.viewers[id]     = viewer;
  // Once we have the JSON representation in-hand, finish loading the viewer.
  var continueLoad = DV.loadJSON = function(json) {
    var viewer = DV.viewers[json.id];
    viewer.schema.importCanonicalDocument(json);
    viewer.loadModels();
    DV.jQuery(function() {
      viewer.open('InitialLoad');
      if (options.afterLoad) options.afterLoad(viewer);
      if (DV.afterLoad) DV.afterLoad(viewer);
      if (DV.recordHit) viewer.recordHit(DV.recordHit);
    });
  };

  /**
   * If we've been passed the JSON directly, we can go ahead,
   * otherwise make a JSONP request to fetch it.
   */
  var jsonLoad = function() {
    if (_.isString(documentRep)) {
      if (documentRep.match(/\.js$/)) {
        DV.jQuery.getScript(documentRep);
      } else {
        var crossDomain = viewer.helpers.isCrossDomain(documentRep);
        if (crossDomain) documentRep = documentRep + '?callback=?';
        DV.jQuery.getJSON(documentRep, continueLoad);
      }
    } else {
      continueLoad(documentRep);
    }
  };

  // If we're being asked the fetch the templates, load them remotely before
  // continuing
  if (options.templates) {
    DV.jQuery.getScript(options.templates, jsonLoad);
  } else {
    jsonLoad();
  }

  return viewer;
};


// If the document viewer has been loaded dynamically, allow the external
// script to specify the onLoad behavior.
if (DV.onload) _.defer(DV.onload);