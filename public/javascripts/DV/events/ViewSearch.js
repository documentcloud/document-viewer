/**
 * @class DV.Schema.events.ViewSearch
 */
DV.Schema.events.ViewSearch = {
  /**
   * @method next
   * @param  {Event} e
   */
  next: function(e){
    var nextPage = this.models.document.nextPage();
    this.loadText(nextPage);

    this.viewer.open('ViewText');
  },
  /**
   * @method previous
   * @param  {Event} e
   */
  previous: function(e){
    var previousPage = this.models.document.previousPage();
    this.loadText(previousPage);

    this.viewer.open('ViewText');
  },
  /**
   * @method search
   * @param  {Event} e
   * @return {Boolean}
   */
  search: function(e){
    e.preventDefault();
    this.helpers.getSearchResponse(this.elements.searchInput.val());

    return false;
  }
};