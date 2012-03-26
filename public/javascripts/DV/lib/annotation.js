/**
 * @class  DV.Annotation
 */
/**
 * @method constructor
 * @param {Object} argHash
 */
DV.Annotation = function(argHash){
  this.position     = { top: argHash.top, left: argHash.left };
  this.dimensions   = { width: argHash.width, height: argHash.height };
  this.page         = argHash.page;
  this.pageEl       = argHash.pageEl;
  this.annotationContainerEl = argHash.annotationContainerEl;
  this.viewer       = this.page.set.viewer;
  this.annotationEl = null;
  this.renderedHTML = argHash.renderedHTML;
  this.type         = argHash.type;
  this.id           = argHash.id;
  this.model        = this.viewer.models.annotations.getAnnotation(this.id);
  this.state        = 'collapsed';
  this.active       = false;
  this.remove();
  this.add();

  if(argHash.active){
    this.viewer.helpers.setActiveAnnotationLimits(this);
    this.viewer.events.resetTracker();
    this.active = null;
    // this.viewer.elements.window[0].scrollTop += this.annotationEl.offset().top;
    this.show();
    if (argHash.showEdit) this.showEdit();
  }
};

/**
 * @method add
 * Add annotation to page
 */
DV.Annotation.prototype.add = function(){
  if(this.type === 'page'){
    this.annotationEl = this.renderedHTML.insertBefore(this.annotationContainerEl);
  }else{
    if(this.page.annotations.length > 0){
      for(var i = 0,len = this.page.annotations.length;i<len;i++){
        if(this.page.annotations[i].id === this.id){

          return false;
        }else{

          this.annotationEl = this.renderedHTML.appendTo(this.annotationContainerEl);
        }
      }
    }else{

      this.annotationEl = this.renderedHTML.appendTo(this.annotationContainerEl);
    }
  }
};

/**
 * @method next
 * Jump to next annotation
 */
DV.Annotation.prototype.next = function(){
  this.hide.preventRemovalOfCoverClass = true;

  var annotation = this.viewer.models.annotations.getNextAnnotation(this.id);
  if(!annotation){
    return;
  }

  this.page.set.showAnnotation({ index: annotation.index, id: annotation.id, top: annotation.top });
};

/**
 * @method previous
 * Jump to previous annotation
 */
DV.Annotation.prototype.previous = function(){
  this.hide.preventRemovalOfCoverClass = true;
  var annotation = this.viewer.models.annotations.getPreviousAnnotation(this.id);
  if(!annotation) {
    return;
  }
  this.page.set.showAnnotation({ index: annotation.index, id: annotation.id, top: annotation.top });
};

/**
 * @method show
 * Show annotation
 * @param {Object} argHash
 */
DV.Annotation.prototype.show = function(argHash) {

  if (this.viewer.activeAnnotation && this.viewer.activeAnnotation.id != this.id) {
    this.viewer.activeAnnotation.hide();
  }
  this.viewer.annotationToLoadId = null;
  this.viewer.elements.window.addClass('DV-coverVisible');

  this.annotationEl.find('div.DV-annotationBG').css({ display: 'block', opacity: 1 });
  this.annotationEl.addClass('DV-activeAnnotation');
  this.viewer.activeAnnotation   = this;

  // Enable annotation tracking to ensure the active state hides on scroll
  this.viewer.helpers.addObserver('trackAnnotation');
  this.viewer.helpers.setActiveAnnotationInNav(this.id);
  this.active                         = true;
  this.pageEl.parent('.DV-set').addClass('DV-activePage');
  // this.viewer.history.save('document/p'+(parseInt(this.page.index,10)+1)+'/a'+this.id);

  if (argHash && argHash.edit) {
    this.showEdit();
  }
};

/**
 * @method hide
 * Hide annotation
 * @param  {Boolean} forceOverlayHide
 */
DV.Annotation.prototype.hide = function(forceOverlayHide){
  var pageNumber = parseInt(this.viewer.elements.currentPage.text(),10);

  if(this.type !== 'page'){
    this.annotationEl.find('div.DV-annotationBG').css({ opacity: 0, display: 'none' });
  }

  var isEditing = this.annotationEl.hasClass('DV-editing');

  this.annotationEl.removeClass('DV-editing DV-activeAnnotation');
  if(forceOverlayHide === true){
    this.viewer.elements.window.removeClass('DV-coverVisible');
  }
  if(this.hide.preventRemovalOfCoverClass === false || !this.hide.preventRemovalOfCoverClass){
    this.viewer.elements.window.removeClass('DV-coverVisible');
    this.hide.preventRemovalOfCoverClass = false;
  }

  // stop tracking this annotation
  this.viewer.activeAnnotation                = null;
  this.viewer.events.trackAnnotation.h        = null;
  this.viewer.events.trackAnnotation.id       = null;
  this.viewer.events.trackAnnotation.combined = null;
  this.active                                 = false;
  this.viewer.pageSet.setActiveAnnotation(null);
  this.viewer.helpers.removeObserver('trackAnnotation');
  this.viewer.helpers.setActiveAnnotationInNav();
  this.pageEl.parent('.DV-set').removeClass('DV-activePage');
  this.removeConnector(true);

  if (isEditing) {
    this.viewer.helpers.saveAnnotation({target : this.annotationEl}, 'onlyIfText');
  }
};

/**
 * @method toggle
 * Toggle annotation
 * @param  {Object} argHash
 */
DV.Annotation.prototype.toggle = function(argHash){
  if (this.viewer.activeAnnotation && (this.viewer.activeAnnotation != this)){
    this.viewer.activeAnnotation.hide();
  }

  if (this.type === 'page') return;

  this.annotationEl.toggleClass('DV-activeAnnotation');
  if(this.active == true){
    this.hide(true);
  }else{
    this.show();
  }
};

/**
 * @method drawConnector
 * Show hover annotation state
 */
DV.Annotation.prototype.drawConnector = function(){
  if(this.active != true){
    this.viewer.elements.window.addClass('DV-annotationActivated');
    this.annotationEl.addClass('DV-annotationHover');
  }
};

/**
 * @method removeConnector
 * Remove hover annotation state
 * @param force Doesn't appear to be used
 */
DV.Annotation.prototype.removeConnector = function(force){
  if(this.active != true){
    this.viewer.elements.window.removeClass('DV-annotationActivated');
    this.annotationEl.removeClass('DV-annotationHover');
  }
};

/**
 * @method showEdit
 * Show edit controls
 */
DV.Annotation.prototype.showEdit = function() {
  this.annotationEl.addClass('DV-editing');
  this.viewer.$('.DV-annotationTitleInput', this.annotationEl).focus();
};

/**
 * @method remove
 * Remove the annotation from the page
 */
DV.Annotation.prototype.remove = function(){
  DV.jQuery('#DV-annotation-'+this.id).remove();
};
