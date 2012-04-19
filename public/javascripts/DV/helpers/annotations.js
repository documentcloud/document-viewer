/**
 * @class  DV.Schema.helpers
 */
_.extend(DV.Schema.helpers, {

  /**
   * @method getAnnotationModel
   * @static
   *
   * @param  {Object} annoEl
   * @return {Object}
   */
  getAnnotationModel : function(annoEl) {
    var annoId = parseInt(annoEl.attr('rel').match(/\d+/), 10);
    return this.models.annotations.getAnnotation(annoId);
  },
  /**
   * @method getAnnotationObject
   * Return the annotation Object that connects with the element in the DOM
   * @static
   *
   * @param  {String} annotation
   * @return {Boolean}
   */
  getAnnotationObject: function(annotation){

    var annotation    = this.viewer.$(annotation);
    var annotationId  = annotation.attr('id').replace(/DV\-annotation\-|DV\-listAnnotation\-/,'');
    var pageId        = annotation.closest('div.DV-set').attr('data-id');

    for(var i = 0; (annotationObject = this.viewer.pageSet.pages[pageId].annotations[i]); i++){
      if(annotationObject.id == annotationId){
        // cleanup
        annotation = null;
        return annotationObject;
      }
    }

    return false;

  },
  /**
   * @method annotationBridgeToggle
   * Set of bridges to access annotation methods
   * Toggle
   * @static
   *
   * @param  {Event} e
   */
  annotationBridgeToggle: function(e){
    e.preventDefault();
    var annotationObject = this.getAnnotationObject(this.viewer.$(e.target).closest(this.annotationClassName));
    annotationObject.toggle();
  },
  /**
   * @method annotationBridgeShow
   * Show annotation
   * @static
   *
   * @param  {Event} e
   */
  annotationBridgeShow: function(e){
    e.preventDefault();
    var annotationObject = this.getAnnotationObject(this.viewer.$(e.target).closest(this.annotationClassName));
    annotationObject.show();
  },
  /**
   * @method annotationBridgeHide
   * Hide annotation
   * @static
   *
   * @param  {Event} e
   */
  annotationBridgeHide: function(e){
    e.preventDefault();
    var annotationObject = this.getAnnotationObject(this.viewer.$(e.target).closest(this.annotationClassName));
    annotationObject.hide(true);
  },
  /**
   * @method annotationBridgeNext
   * Jump to the next annotation
   * @static
   *
   * @param  {Event} e
   */
  annotationBridgeNext: function(e){
    e.preventDefault();
    var annotationObject = this.getAnnotationObject(this.viewer.$(e.target).closest(this.annotationClassName));
    annotationObject.next();
  },
  /**
   * @method annotationBridgePrevious
   * Jump to the previous annotation
   * @static
   *
   * @param  {Event} e
   */
  annotationBridgePrevious: function(e){
    e.preventDefault();
    var annotationObject = this.getAnnotationObject(this.viewer.$(e.target).closest(this.annotationClassName));
    annotationObject.previous();
  },
  /**
   * @method setAnnotationPosition
   * Update currentpage text to indicate current annotation
   * @static
   *
   * @param {String} _position
   */
  setAnnotationPosition: function(_position){
    this.elements.currentPage.text(_position);
  },
  /**
   * @method setActiveAnnotationLimits
   * Update active annotation limits
   * @static
   *
   * @param {Object} annotation
   */
  setActiveAnnotationLimits: function(annotation){
    var annotation = (annotation) ? annotation : this.viewer.activeAnnotation;

    if(!annotation || annotation == null){
      return;
    }

    var elements  = this.elements;
    var aPage     = annotation.page;
    var aEl       = annotation.annotationEl;
    var aPosTop   = annotation.position.top * this.models.pages.zoomFactor();
    var _trackAnnotation = this.events.trackAnnotation;

    if(annotation.type === 'page'){
      _trackAnnotation.h          = aEl.outerHeight()+aPage.getOffset();
      _trackAnnotation.combined   = (aPage.getOffset()) - elements.window.height();
    }else{
      _trackAnnotation.h          = aEl.height()+aPosTop-20+aPage.getOffset()+aPage.getPageNoteHeight();
      _trackAnnotation.combined   = (aPosTop-20+aPage.getOffset()+aPage.getPageNoteHeight()) - elements.window.height();
    }

  }
});