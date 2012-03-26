/**
 * @class  DV.Schema.events
 */
_.extend(DV.Schema.events, {

  /**
   * @method handleHashChangeViewDocumentPage
   * #document/p[pageID]
   * @static
   *
   * @param  {Number} page
   */
  handleHashChangeViewDocumentPage: function(page){
    var pageIndex = parseInt(page,10) - 1;
    if(this.viewer.state === 'ViewDocument'){
      this.viewer.pageSet.cleanUp();
      this.helpers.jump(pageIndex);
    }else{
      this.models.document.setPageIndex(pageIndex);
      this.viewer.open('ViewDocument');
    }
  },

  /**
   * @method handleHashChangeLegacyViewDocumentPage
   * #p[pageID]
   * @static
   *
   * @param {Number} page
   */
  handleHashChangeLegacyViewDocumentPage: function(page){
    var pageIndex   = parseInt(page,10) - 1;
    this.handleHashChangeViewDocumentPage(page);
  },

  /**
   * @method handleHashChangeViewDocumentAnnotation
   * #document/p[pageID]/a[annotationID]
   * @static
   *
   * @param  {Number} page
   * @param  {Number} annotation
   */
  handleHashChangeViewDocumentAnnotation: function(page,annotation){
    var pageIndex   = parseInt(page,10) - 1;
    var annotation  = parseInt(annotation,10);

    if(this.viewer.state === 'ViewDocument'){
      this.viewer.pageSet.showAnnotation(this.viewer.models.annotations.byId[annotation]);
    }else{
      this.models.document.setPageIndex(pageIndex);
      this.viewer.pageSet.setActiveAnnotation(annotation);
      this.viewer.openingAnnotationFromHash = true;
      this.viewer.open('ViewDocument');
    }
  },

  /**
   * @method handleHashChangeViewAnnotationAnnotation
   * #annotation/a[annotationID]
   * @static
   *
   * @param  {Number} annotation
   */
  handleHashChangeViewAnnotationAnnotation: function(annotation){
    var annotation  = parseInt(annotation,10);
    var viewer = this.viewer;

    if(viewer.state === 'ViewAnnotation'){
      viewer.pageSet.showAnnotation(this.viewer.models.annotations.byId[annotation]);
    }else{
      viewer.activeAnnotationId = annotation;
      this.viewer.open('ViewAnnotation');
    }
  },

  /**
   * @method handleHashChangeDefault
   * Default route if all else fails
   * @static
   */
  handleHashChangeDefault: function(){
    this.viewer.pageSet.cleanUp();
    this.models.document.setPageIndex(0);

    if(this.viewer.state === 'ViewDocument'){
      this.helpers.jump(0);
      // this.viewer.history.save('document/p1');
    }else{
      this.viewer.open('ViewDocument');
    }
  },

  /**
   * @method handleHashChangeViewText
   * #text/p[pageID]
   * @static
   *
   * @param {Number} page
   */
  handleHashChangeViewText: function(page){
    var pageIndex = parseInt(page,10) - 1;
    if(this.viewer.state === 'ViewText'){
      this.events.loadText(pageIndex);
    }else{
      this.models.document.setPageIndex(pageIndex);
      this.viewer.open('ViewText');
    }
  },

  /**
   * @method handleHashChangeViewPages
   * @static
   */
  handleHashChangeViewPages: function() {
    if (this.viewer.state == 'ViewThumbnails') return;
    this.viewer.open('ViewThumbnails');
  },

  /**
   * @method handleHashChangeViewSearchRequest
   * #search/[searchString]
   * @static
   *
   * @param  {Number} page
   * @param  {String} query
   */
  handleHashChangeViewSearchRequest: function(page,query){
    var pageIndex = parseInt(page,10) - 1;
    this.elements.searchInput.val(decodeURIComponent(query));

    if(this.viewer.state !== 'ViewSearch'){
      this.models.document.setPageIndex(pageIndex);
    }
    this.viewer.open('ViewSearch');
  },

  /**
   * @method handleHashChangeViewEntity
   * #entity/p[pageID]/[searchString]/[offset]:[length]
   * @static
   *
   * @param  {Number} page
   * @param  {String} name
   * @param  {Number} offset
   * @param  {Number} length
   */
  handleHashChangeViewEntity: function(page, name, offset, length) {
    page = parseInt(page,10) - 1;
    name = decodeURIComponent(name);
    this.elements.searchInput.val(name);
    this.models.document.setPageIndex(page);
    this.states.ViewEntity(name, parseInt(offset, 10), parseInt(length, 10));
  }
});
