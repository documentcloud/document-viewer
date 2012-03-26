/**
 * @class DV.Schema.events.ViewThumbnails
 */
DV.Schema.events.ViewThumbnails = {
  /**
   * @method next
   * @static
   */
  next: function(){
    var nextPage = this.models.document.nextPage();
    this.helpers.jump(nextPage);
  },
  /**
   * @method previous
   * @static
   */
  previous: function(e){
    var previousPage = this.models.document.previousPage();
    this.helpers.jump(previousPage);
  },
  /**
   * @method search
   * @static
   * @return {Boolean}
   */
  search: function(e){
    e.preventDefault();

    this.viewer.open('ViewSearch');
    return false;
  }
};