DV._.extend(DV.Schema.events, {
  handleNavigation: function(e){
    var el          = this.viewer.$(e.target);
    var triggerEl   = el.closest('.DV-trigger');
    var noteEl      = el.closest('.DV-annotationMarker');
    var chapterEl   = el.closest('.DV-chapter');
    if (!triggerEl.length) return;

    if (el.hasClass('DV-expander')) {
      return chapterEl.toggleClass('DV-collapsed');

    } else if (noteEl.length) {
      var aid         = noteEl[0].id.replace('DV-annotationMarker-','');
      var annotation  = this.models.annotations.getAnnotation(aid);
      var pageNumber  = parseInt(annotation.index,10)+1;

      if(this.viewer.state === 'ViewText'){
        this.loadText(annotation.index);

        // this.viewer.history.save('text/p'+pageNumber);
      } else{
        if (this.viewer.state === 'ViewThumbnails') {
          this.viewer.open('ViewDocument');
        }
        this.viewer.pageSet.showAnnotation(annotation);
      }

    } else if (chapterEl.length) {
      // its a header, take it to the page
      chapterEl.removeClass('DV-collapsed');
      var cid           = parseInt(chapterEl[0].id.replace('DV-chapter-',''), 10);
      var chapterIndex  = parseInt(this.models.chapters.getChapterPosition(cid),10);
      var pageNumber    = parseInt(chapterIndex,10)+1;

      if(this.viewer.state === 'ViewText'){
        this.loadText(chapterIndex);
        // this.viewer.history.save('text/p'+pageNumber);
      } else if(this.viewer.state === 'ViewDocument' ||
               this.viewer.state === 'ViewThumbnails'){
        this.helpers.jump(chapterIndex);
        // this.viewer.history.save('document/p'+pageNumber);
        if (this.viewer.state === 'ViewThumbnails') {
          this.viewer.open('ViewDocument');
        }
      } else{
        return false;
      }

    } else{
      return false;
    }
  }
});