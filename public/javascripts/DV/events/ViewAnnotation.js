/**
 * @class DV.Schema.events.ViewAnnotation
 */
DV.Schema.events.ViewAnnotation = {

  /**
   * @method next
   * @static
   * @param {Event} e
   * @return {Boolean}
   */
  next: function(e){
    var viewer              = this.viewer;
    var activeAnnotationId  = viewer.activeAnnotationId;
    var annotationsModel    = this.models.annotations;
    var nextAnnotation      = (activeAnnotationId === null) ?
        annotationsModel.getFirstAnnotation() : annotationsModel.getNextAnnotation(activeAnnotationId);

    if (!nextAnnotation){
      return false;
    }

    viewer.pageSet.showAnnotation(nextAnnotation);
    this.helpers.setAnnotationPosition(nextAnnotation.position);


  },
  /**
   * @method previous
   * @static
   * @param {Event} e
   * @return {Boolean}
   */
  previous: function(e){
    var viewer              = this.viewer;
    var activeAnnotationId  = viewer.activeAnnotationId;
    var annotationsModel    = this.models.annotations;

    var previousAnnotation = (!activeAnnotationId) ?
    annotationsModel.getFirstAnnotation() : annotationsModel.getPreviousAnnotation(activeAnnotationId);
    if (!previousAnnotation){
      return false;
    }

    viewer.pageSet.showAnnotation(previousAnnotation);
    this.helpers.setAnnotationPosition(previousAnnotation.position);


  },
  /**
   * @method search
   * @static
   * @param {Event} e
   * @return {Boolean}
   */
  search: function(e){
    e.preventDefault();
    this.viewer.open('ViewSearch');

    return false;
  }
};