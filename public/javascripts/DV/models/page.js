// The Pages model represents the set of pages in the document, containing the
// image sources for each page, and the page proportions.
DV.model.Pages = function(viewer) {
  this.viewer     = viewer;

  // Rolling average page height.
  this.averageHeight   = 0;

  // Real page heights.
  this.pageHeights     = [];

  // Real page note heights.
  this.pageNoteHeights = [];

  // In pixels.
  this.BASE_WIDTH      = 700;
  this.BASE_HEIGHT     = 906;

  // Factors for scaling from image size to zoomlevel.
  this.SCALE_FACTORS   = {'500': 0.714, '700': 1.0, '800': 0.8, '900': 0.9, '1000': 1.0};

  // For viewing page text.
  this.DEFAULT_PADDING = 100;

  // Embed reduces padding.
  this.REDUCED_PADDING = 44;

  // Mini padding, when < 500 px wide.
  this.MINI_PADDING    = 18;

  this.zoomLevel  = this.viewer.models.document.zoomLevel;
  this.baseWidth  = this.BASE_WIDTH;
  this.baseHeight = this.BASE_HEIGHT;
  this.width      = this.zoomLevel;
  this.height     = this.baseHeight * this.zoomFactor();
  this.numPagesLoaded = 0;
};

DV.model.Pages.prototype = {

  // Get the complete image URL for a particular page.
  imageURL: function(index) {
    var url  = this.viewer.schema.document.resources.page.image;
    var size = this.zoomLevel > this.BASE_WIDTH ? 'large' : 'normal';
    var pageNumber = index + 1;
    if (this.viewer.schema.document.resources.page.zeropad) pageNumber = this.zeroPad(pageNumber, 5);
    url = url.replace(/\{size\}/, size);
    url = url.replace(/\{page\}/, pageNumber);
    return url;
  },

  zeroPad : function(num, count) {
    var string = num.toString();
    while (string.length < count) string = '0' + string;
    return string;
  },

  // Return the appropriate padding for the size of the viewer.
  getPadding: function() {
    if (this.viewer.elements.viewer.hasClass('DV-mini')) {
      return this.MINI_PADDING;
    } else if (this.viewer.options.zoom == 'auto') {
      return this.REDUCED_PADDING;
    } else {
      return this.DEFAULT_PADDING;
    }
  },

  // The zoom factor is the ratio of the image width to the baseline width.
  zoomFactor : function() {
    return this.zoomLevel / this.BASE_WIDTH;
  },

  // Resize or zoom the pages width and height.
  resize : function(zoomLevel) {
    var padding = this.viewer.models.pages.DEFAULT_PADDING;

    if (zoomLevel) {
      if (zoomLevel == this.zoomLevel) return;
      var previousFactor  = this.zoomFactor();
      this.zoomLevel      = zoomLevel || this.zoomLevel;
      var scale           = this.zoomFactor() / previousFactor;
      this.width          = Math.round(this.baseWidth * this.zoomFactor());
      this.height         = Math.round(this.height * scale);
      this.averageHeight  = Math.round(this.averageHeight * scale);
    }

    this.viewer.elements.sets.width(this.zoomLevel);
    this.viewer.elements.collection.css({width : this.width + padding });
    var minFontSize = 10;
    var fontSize = Math.max(minFontSize, this.zoomLevel * 0.02);
    this.viewer.$('.DV-textContents').css({'font-size' : fontSize + 'px'});
  },

  // Update the height for a page, when its real image has loaded.
  updateHeight: function(image, pageIndex) {
    var h = this.getPageHeight(pageIndex);
    var height = image.height * (this.zoomLevel > this.BASE_WIDTH ? 0.7 : 1.0);
    if (image.width < this.baseWidth) {
      // Not supposed to happen, but too-small images sometimes do.
      height *= (this.baseWidth / image.width);
    }
    this.setPageHeight(pageIndex, height);
    this.averageHeight = ((this.averageHeight * this.numPagesLoaded) + height) / (this.numPagesLoaded + 1);
    this.numPagesLoaded += 1;
    if (h === height) return;
    this.viewer.models.document.computeOffsets();
    this.viewer.pageSet.simpleReflowPages();
    if (!this.viewer.activeAnnotation && (pageIndex < this.viewer.models.document.currentIndex())) {
      var diff = Math.round(height * this.zoomFactor() - h);
      this.viewer.elements.window[0].scrollTop += diff;
    }
  },

  // set the real page height
  setPageHeight: function(pageIndex, pageHeight) {
    this.pageHeights[pageIndex] = Math.round(pageHeight);
  },

  // get the real page height
  getPageHeight: function(pageIndex) {
    var realHeight = this.pageHeights[pageIndex];
    return Math.round(realHeight ? realHeight * this.zoomFactor() : this.height);
  }

};
