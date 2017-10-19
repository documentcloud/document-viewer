DV.model.Chapters = function(viewer) {
  this.viewer = viewer;
  this.loadChapters();
};

DV.model.Chapters.prototype = {

  // Load (or reload) the chapter model from the schema's defined sections.
  loadChapters : function() {
    var sections = this.viewer.schema.data.sections;
    var chapters = this.chapters = this.viewer.schema.data.chapters = [];
    DV._.each(sections, function(sec){ sec.id || (sec.id = DV._.uniqueId()); });

    // loop through the list of pages.
    var sectionIndex = 0;
    for (var currentPage = 0, l = this.viewer.schema.data.totalPages; currentPage < l; currentPage++) {
      // check what section we're in.
      var currentSection = sections[sectionIndex];
      // check what the next currentSection break is.
      var nextSection = sections[sectionIndex + 1];
      if (nextSection && (currentPage >= (nextSection.page - 1))) {
        sectionIndex += 1;
        currentSection = nextSection;
      }
      if (currentSection && !(currentSection.page > currentPage + 1)) chapters[currentPage] = parseInt(currentSection.id, 10);
    }
  },

  getChapterId: function(index){
    return this.chapters[index];
  },

  getChapterPosition: function(chapterId){
    if (! DV._.isNumber(chapterId)) {
      console.log("chapterId isn't a number, attempting to coerce...");
      chapterId = parseInt(chapterId, 10);
    }
    for(var i = 0,len=this.chapters.length; i < len; i++){
      if( this.chapters[i] === chapterId){ return i; }
    }
  }  
};
