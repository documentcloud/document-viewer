/**
 * @class DV.Schema.events.ViewText
 */
DV.Schema.events.ViewText = {
  /**
   * @method next
   * @param  {Event} e
   */
  next: function(e){
    var nextPage = this.models.document.nextPage();
    this.loadText(nextPage);
  },
  /**
   * @method previous
   * @param  {Event} e
   */
  previous: function(e){
    var previousPage = this.models.document.previousPage();
    this.loadText(previousPage);
  },
  /**
   * @method search
   * @param  {Event} e
   * @return {Boolean}
   */
  search: function(e){
    e.preventDefault();
    this.viewer.open('ViewSearch');

    return false;
  }
};