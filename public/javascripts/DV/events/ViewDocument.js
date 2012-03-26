/**
 * @class  DV.Schema.events.ViewDocument
 */
DV.Schema.events.ViewDocument = {
  /**
   * @method next
   */
  next: function(){
    var nextPage = this.models.document.nextPage();
    this.helpers.jump(nextPage);

    // this.viewer.history.save('document/p'+(nextPage+1));
  },
  /**
   * @method previous
   * @param {Event} e
   */
  previous: function(e){
    var previousPage = this.models.document.previousPage();
    this.helpers.jump(previousPage);

    // this.viewer.history.save('document/p'+(previousPage+1));
  },
  /**
   * @method search
   * @param {Event} e
   */
  search: function(e){
    e.preventDefault();

    this.viewer.open('ViewSearch');
    return false;
  }
};