/**
 * @class DV.Schema.events.ViewThumbnails
 */
DV.Schema.events.ViewThumbnails = {
  /**
   * @method next
   */
  next: function(){
    var nextPage = this.models.document.nextPage();
    this.helpers.jump(nextPage);
  },
  /**
   * @method previous
   */
  previous: function(e){
    var previousPage = this.models.document.previousPage();
    this.helpers.jump(previousPage);
  },
  /**
   * @method search
   * @return {Boolean}
   */
  search: function(e){
    e.preventDefault();

    this.viewer.open('ViewSearch');
    return false;
  }
};