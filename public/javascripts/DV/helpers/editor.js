_.extend(DV.Schema.helpers,{
  showAnnotationEdit : function(e) {
    var annoEl = this.viewer.$(e.target).closest(this.annotationClassName);
    var area   = this.viewer.$('.DV-annotationTextArea', annoEl);
    annoEl.addClass('DV-editing');
    area.focus();
  },
  cancelAnnotationEdit : function(e) {
    var annoEl = this.viewer.$(e.target).closest(this.annotationClassName);
    var anno   = this.getAnnotationModel(annoEl);
    this.viewer.$('.DV-annotationTitleInput', annoEl).val(anno.title);
    this.viewer.$('.DV-annotationTextArea', annoEl).val(anno.text);
    if (anno.unsaved) {
      this.viewer.model.notes.removeAnnotation(anno);
    } else {
      annoEl.removeClass('DV-editing');
    }
  },
  saveAnnotation : function(e, option) {
    var target = this.viewer.$(e.target);
    var annoEl = target.closest(this.annotationClassName);
    var anno   = this.getAnnotationModel(annoEl);
    if (!anno) return;
    anno.title     = this.viewer.$('.DV-annotationTitleInput', annoEl).val();
    anno.text      = this.viewer.$('.DV-annotationTextArea', annoEl).val();
    anno.owns_note = anno.unsaved ? true : anno.owns_note;
    if (anno.owns_note) {
      anno.author              = anno.author || dc.account.name;
      anno.author_organization = anno.author_organization || (dc.account.isReal && dc.account.organization.name);
    }
    if (target.hasClass('DV-saveAnnotationDraft'))  anno.access = 'exclusive';
    else if (annoEl.hasClass('DV-accessExclusive')) anno.access = 'public';
    if (option == 'onlyIfText' &&
        (!anno.title || anno.title == 'Untitled Note') &&
        !anno.text &&
        !anno.server_id) {
      return this.viewer.model.notes.removeAnnotation(anno);
    }
    annoEl.removeClass('DV-editing');
    // needs to be turned into an event trigger.
    //this.viewer.model.notes.fireSaveCallbacks(anno);
    note.save();
    this.viewer.api.redraw(true);
    if (this.viewer.activeAnnotation) this.viewer.pages.showAnnotation(anno);
  },
  deleteAnnotation : function(e) {
    var annoEl = this.viewer.$(e.target).closest(this.annotationClassName);
    var anno   = this.getAnnotationModel(annoEl);
    this.viewer.model.notes.removeAnnotation(anno);
    this.viewer.model.notes.fireDeleteCallbacks(anno);
  }
});