DV.model.Annotations = function(viewer) {
  this.LEFT_MARGIN              = 25;
  this.PAGE_NOTE_FUDGE          = window.dc && dc.account && (dc.account.isOwner || dc.account.isReviewer) ? 46 : 26;
  this.viewer                   = viewer;
  this.offsetsAdjustments       = [];
  this.offsetAdjustmentSum      = 0;
  this.saveCallbacks            = [];
  this.deleteCallbacks          = [];
  this.byId                     = this.viewer.schema.data.annotationsById;
  this.byPage                   = this.viewer.schema.data.annotationsByPage;
  this.bySortOrder              = this.sortAnnotations();
};

DV.model.Annotations.prototype = {

  // Render an annotation model to HTML, calculating all of the dimenstions
  // and offsets, and running a template function.
  render: function(annotation){
    var documentModel             = this.viewer.models.document;
    var pageModel                 = this.viewer.models.pages;
    var zoom                      = pageModel.zoomFactor();
    var adata                     = annotation;
    var x1, x2, y1, y2;

    if(adata.type === 'page'){
      x1 = x2 = y1 = y2           = 0;
      adata.top                   = 0;
    }else{
      y1                          = Math.round(adata.y1 * zoom);
      y2                          = Math.round(adata.y2 * zoom);
      if (x1 < this.LEFT_MARGIN) x1 = this.LEFT_MARGIN;
      x1                          = Math.round(adata.x1 * zoom);
      x2                          = Math.round(adata.x2 * zoom);
      adata.top                   = y1 - 5;
    }

    adata.owns_note               = adata.owns_note || false;
    adata.width                   = pageModel.width;
    adata.pageNumber              = adata.page;
    adata.author                  = adata.author || "";
    adata.author_organization     = adata.author_organization || "";
    adata.bgWidth                 = adata.width;
    adata.bWidth                  = adata.width - 16;
    adata.excerptWidth            = (x2 - x1) - 8;
    adata.excerptMarginLeft       = x1 - 3;
    adata.excerptHeight           = y2 - y1;
    adata.index                   = adata.page - 1;
    adata.image                   = pageModel.imageURL(adata.index);
    adata.imageTop                = y1 + 1;
    adata.tabTop                  = (y1 < 35 ? 35 - y1 : 0) + 8;
    adata.imageWidth              = pageModel.width;
    adata.imageHeight             = Math.round(pageModel.height * zoom);
    adata.regionLeft              = x1;
    adata.regionWidth             = x2 - x1 ;
    adata.regionHeight            = y2 - y1;
    adata.excerptDSHeight         = adata.excerptHeight - 6;
    adata.DSOffset                = 3;

    if (adata.access == 'public')         adata.accessClass = 'DV-accessPublic';
    else if (adata.access =='exclusive')  adata.accessClass = 'DV-accessExclusive';
    else if (adata.access =='private')    adata.accessClass = 'DV-accessPrivate';

    adata.orderClass = '';
    adata.options = this.viewer.options;
    if (adata.position == 1) adata.orderClass += ' DV-firstAnnotation';
    if (adata.position == this.bySortOrder.length) adata.orderClass += ' DV-lastAnnotation';

    var template = (adata.type === 'page') ? 'pageAnnotation' : 'annotation';
    return JST[template](adata);
  },

  // Re-sort the list of annotations when its contents change. Annotations
  // are ordered by page primarily, and then their y position on the page.
  sortAnnotations : function() {
    return this.bySortOrder = _.sortBy(_.values(this.byId), function(anno) {
      return anno.page * 10000 + anno.y1;
    });
  },

  // Renders each annotation into it's HTML format.
  renderAnnotations: function(){
    if (this.viewer.options.showAnnotations === false) return;
            
    for (var i=0; i<this.bySortOrder.length; i++) {
      var anno      = this.bySortOrder[i];
      anno.of       = _.indexOf(this.byPage[anno.page - 1], anno);
      anno.position = i + 1;
      anno.html     = this.render(anno);
    }
    this.renderAnnotationsByIndex();
  },

  // Renders each annotation for the "Annotation List" tab, in order.
  renderAnnotationsByIndex: function(){
    var rendered  = _.map(this.bySortOrder, function(anno){ return anno.html; });
    var html      = rendered.join('')
                    .replace(/class="DV-img" src="/g, 'class="DV-img" data-src="')
                    .replace(/id="DV-annotation-(\d+)"/g, function(match, id) {
      return 'id="DV-listAnnotation-' + id + '" rel="aid-' + id + '"';
    });

    this.viewer.$('div.DV-allAnnotations').html(html);

    this.renderAnnotationsByIndex.rendered  = true;
    this.renderAnnotationsByIndex.zoomLevel = this.zoomLevel;

    // TODO: This is hacky, but seems to be necessary. When fixing, be sure to
    // test with both autozoom and page notes.
    this.updateAnnotationOffsets();
    _.defer(_.bind(this.updateAnnotationOffsets, this));
  },

  // Refresh the annotation's title and content from the model, in both
  // The document and list views.
  refreshAnnotation : function(anno) {
    var viewer = this.viewer;
    anno.html = this.render(anno);
    DV.jQuery.$('#DV-annotation-' + anno.id).replaceWith(anno.html);
  },

  // Removes a given annotation from the Annotations model (and DOM).
  removeAnnotation : function(anno) {
    delete this.byId[anno.id];
    var i = anno.page - 1;
    this.byPage[i] = _.without(this.byPage[i], anno);
    this.sortAnnotations();
    DV.jQuery('#DV-annotation-' + anno.id + ', #DV-listAnnotation-' + anno.id).remove();
    this.viewer.api.redraw(true);
    if (_.isEmpty(this.byId)) this.viewer.open('ViewDocument');
  },

  // Offsets all document pages based on interleaved page annotations.
  updateAnnotationOffsets: function(){
    this.offsetsAdjustments   = [];
    this.offsetAdjustmentSum  = 0;
    var documentModel         = this.viewer.models.document;
    var annotationsContainer  = this.viewer.$('div.DV-allAnnotations');
    var pageAnnotationEls     = annotationsContainer.find('.DV-pageNote');
    var pageNoteHeights       = this.viewer.models.pages.pageNoteHeights;
    var me = this;

    if(this.viewer.$('div.DV-docViewer').hasClass('DV-viewAnnotations') == false){
      annotationsContainer.addClass('DV-getHeights');
    }

    // First, collect the list of page annotations, and associate them with
    // their DOM elements.
    var pageAnnos = [];
    _.each(_.select(this.bySortOrder, function(anno) {
      return anno.type == 'page';
    }), function(anno, i) {
      anno.el = pageAnnotationEls[i];
      pageAnnos[anno.pageNumber] = anno;
    });

    // Then, loop through the pages and store the cumulative offset due to
    // page annotations.
    for (var i = 0, len = documentModel.totalPages; i <= len; i++) {
      pageNoteHeights[i] = 0;
      if (pageAnnos[i]) {
        var height = (this.viewer.$(pageAnnos[i].el).height() + this.PAGE_NOTE_FUDGE);
        pageNoteHeights[i - 1] = height;
        this.offsetAdjustmentSum += height;
      }
      this.offsetsAdjustments[i] = this.offsetAdjustmentSum;
    }
    annotationsContainer.removeClass('DV-getHeights');
  },

  // When an annotation is successfully saved, fire any registered
  // save callbacks.
  fireSaveCallbacks : function(anno) {
    _.each(this.saveCallbacks, function(c){ c(anno); });
  },

  // When an annotation is successfully removed, fire any registered
  // delete callbacks.
  fireDeleteCallbacks : function(anno) {
    _.each(this.deleteCallbacks, function(c){ c(anno); });
  },

  // Returns the list of annotations on a given page.
  getAnnotations: function(_index){
    return this.byPage[_index];
  },

  getFirstAnnotation: function(){
    return _.first(this.bySortOrder);
  },

  getNextAnnotation: function(currentId) {
    var anno = this.byId[currentId];
    return this.bySortOrder[_.indexOf(this.bySortOrder, anno) + 1];
  },

  getPreviousAnnotation: function(currentId) {
    var anno = this.byId[currentId];
    return this.bySortOrder[_.indexOf(this.bySortOrder, anno) - 1];
  },

  // Get an annotation by id, with backwards compatibility for argument hashes.
  getAnnotation: function(identifier) {
    if (identifier.id) return this.byId[identifier.id];
    if (identifier.index && !identifier.id) throw new Error('looked up an annotation without an id');
    return this.byId[identifier];
  }

};
