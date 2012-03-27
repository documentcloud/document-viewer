/**
 * @class  DV.Schema.helpers
 */
_.extend(DV.Schema.helpers, {
  /**
   * @method resetNavigationState
   * @static
   */
  resetNavigationState: function(){
    var elements                      = this.elements;
    if (elements.chaptersContainer.length) elements.chaptersContainer[0].id  = '';
    if (elements.navigation.length)        elements.navigation[0].id         = '';
  },
  /**
   * @method setActiveChapter
   * @static
   * @param {String} chapterId
   */
  setActiveChapter: function(chapterId){
    if (chapterId) this.elements.chaptersContainer.attr('id','DV-selectedChapter-'+chapterId);
  },
  /**
   * @method setActiveAnnotationInNav
   * @param {String} annotationId
   * @static
   */
  setActiveAnnotationInNav: function(annotationId){
    if(annotationId != null){
      this.elements.navigation.attr('id','DV-selectedAnnotation-'+annotationId);
    }else{
      this.elements.navigation.attr('id','');
    }
  }
});
