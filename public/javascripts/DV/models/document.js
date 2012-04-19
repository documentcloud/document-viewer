/**
 * @class  DV.model.Document
 */
/**
 * @method constructor
 * Instantiates new DV.model.Document
 * @param {Object} viewer instance of viewer
 */
DV.model.Document = function(viewer){
  this.viewer                    = viewer;

  this.currentPageIndex          = 0;
  this.offsets                   = [];
  this.baseHeightsPortion        = [];
  this.baseHeightsPortionOffsets = [];
  this.paddedOffsets             = [];
  this.originalPageText          = {};
  this.totalDocumentHeight       = 0;
  this.totalPages                = 0;
  this.additionalPaddingOnPage   = 0;
  this.ZOOM_RANGES               = [500, 700, 800, 900, 1000];

  var data                       = this.viewer.schema.data;

  this.state                     = data.state;
  this.baseImageURL              = data.baseImageURL;
  this.canonicalURL              = data.canonicalURL;
  this.additionalPaddingOnPage   = data.additionalPaddingOnPage;
  this.pageWidthPadding          = data.pageWidthPadding;
  this.totalPages                = data.totalPages;

  this.onPageChangeCallbacks = [];

  var zoom = this.zoomLevel = this.viewer.options.zoom || data.zoomLevel;
  if (zoom == 'auto') this.zoomLevel = data.zoomLevel;

  // The zoom level cannot go over the maximum image width.
  var maxZoom = _.last(this.ZOOM_RANGES);
  if (this.zoomLevel > maxZoom) this.zoomLevel = maxZoom;
};

DV.model.Document.prototype = {

  /**
   * @method setPageIndex
   * @param {Number} index
   */
  setPageIndex : function(index) {
    this.currentPageIndex = index;
    this.viewer.elements.currentPage.text(this.currentPage());
    this.viewer.helpers.setActiveChapter(this.viewer.models.chapters.getChapterId(index));
    _.each(this.onPageChangeCallbacks, function(c) { c(); });
    return index;
  },
  /**
   * @method currentPage
   * @return {Number}
   */
  currentPage : function() {
    return this.currentPageIndex + 1;
  },
  /**
   * @method currentIndex
   * @return {Number} this.currentPageIndex
   */
  currentIndex : function() {
    return this.currentPageIndex;
  },
  /**
   * @method nextPage
   * @return this.setPageIndex(nextIndex)
   */
  nextPage : function() {
    var nextIndex = this.currentIndex() + 1;
    if (nextIndex >= this.totalPages) return this.currentIndex();
    return this.setPageIndex(nextIndex);
  },
  /**
   * @method previousPage
   * @return this.setPageIndex(previousIndex)
   */
  previousPage : function() {
    var previousIndex = this.currentIndex() - 1;
    if (previousIndex < 0) return this.currentIndex();
    return this.setPageIndex(previousIndex);
  },
  /**
   * @method zoom
   * @param  {Number} zoomLevel
   * @param  {Boolean} force
   */
  zoom: function(zoomLevel,force){
    if(this.zoomLevel != zoomLevel || force === true){
      this.zoomLevel   = zoomLevel;
      this.viewer.models.pages.resize(this.zoomLevel);
      this.viewer.models.annotations.renderAnnotations();
      this.computeOffsets();
    }
  },

  /**
   * @method computeOffsets
   */
  computeOffsets: function() {
    var annotationModel  = this.viewer.models.annotations;
    var totalDocHeight   = 0;
    var adjustedOffset   = 0;
    var len              = this.totalPages;
    var diff             = 0;
    var scrollPos        = this.viewer.elements.window[0].scrollTop;

    for(var i = 0; i < len; i++) {
      if(annotationModel.offsetsAdjustments[i]){
        adjustedOffset   = annotationModel.offsetsAdjustments[i];
      }

      var pageHeight     = this.viewer.models.pages.getPageHeight(i);
      var previousOffset = this.offsets[i] || 0;
      var h              = this.offsets[i] = adjustedOffset + totalDocHeight;

      if((previousOffset !== h) && (h < scrollPos)) {
        var delta = h - previousOffset - diff;
        scrollPos += delta;
        diff += delta;
      }

      this.baseHeightsPortion[i]        = Math.round((pageHeight + this.additionalPaddingOnPage) / 3);
      this.baseHeightsPortionOffsets[i] = (i == 0) ? 0 : h - this.baseHeightsPortion[i];

      totalDocHeight                    += (pageHeight + this.additionalPaddingOnPage);
    }

    // Add the sum of the page note heights to the total document height.
    totalDocHeight += adjustedOffset;

    // artificially set the scrollbar height
    if(totalDocHeight != this.totalDocumentHeight){
      diff = (this.totalDocumentHeight != 0) ? diff : totalDocHeight - this.totalDocumentHeight;
      this.viewer.helpers.setDocHeight(totalDocHeight,diff);
      this.totalDocumentHeight = totalDocHeight;
    }
  },

  /**
   * @method getOffset
   * @param  {String} _index
   * @return this.offsets[_index]
   */
  getOffset: function(_index){
    return this.offsets[_index];
  },

  /**
   * @method resetRemovedPages
   */
  resetRemovedPages: function() {
    this.viewer.models.removedPages = {};
  },

  /**
   * @method addPageToRemovedPages
   * @param {String} page
   */
  addPageToRemovedPages: function(page) {
    this.viewer.models.removedPages[page] = true;
  },

  /**
   * @method removePageFromRemovedPages
   * @param  {String} page
   */
  removePageFromRemovedPages: function(page) {
    this.viewer.models.removedPages[page] = false;
  },

  /**
   * @method redrawPages
   */
  redrawPages: function() {
    _.each(this.viewer.pageSet.pages, function(page) {
      page.drawRemoveOverlay();
    });
    if (this.viewer.thumbnails) {
      this.viewer.thumbnails.render();
    }
  },

  /**
   * @method redrawReorderedPages
   */
  redrawReorderedPages: function() {
    if (this.viewer.thumbnails) {
      this.viewer.thumbnails.render();
    }
  }

};
