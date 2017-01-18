DV.Schema.states = {

  InitialLoad: function(){
    // If we're in an unsupported browser ... bail.
    if (this.helpers.unsupportedBrowser()) return;

    // Insert the Document Viewer HTML into the DOM.
    this.helpers.renderViewer();

    // Assign element references.
    this.events.elements = this.helpers.elements = this.elements = new DV.Elements(this);

    // Render included components, and hide unused portions of the UI.
    this.helpers.renderComponents();

    // Render chapters and notes navigation:
    this.helpers.renderNavigation();

    // Render CSS rules for showing/hiding specific pages:
    this.helpers.renderSpecificPageCss();

    // Instantiate pageset and build accordingly
    this.pageSet = new DV.PageSet(this);
    this.pageSet.buildPages();

    // BindEvents
    this.helpers.bindEvents(this);

    this.helpers.positionViewer();
    this.models.document.computeOffsets();
    this.helpers.addObserver('checkVisibility');
    this.helpers.addObserver('drawPages');
    this.helpers.registerHashChangeEvents();
    this.dragReporter = new DV.DragReporter(this, '.DV-pageCollection',DV.jQuery.proxy(this.helpers.shift, this), { ignoreSelector: '.DV-annotationContent' });
    this.helpers.startCheckTimer();
    this.helpers.handleInitialState();
    DV._.defer(DV._.bind(this.helpers.autoZoomPage, this.helpers));
  },

  ViewAnnotation: function(){
    this.helpers.reset(); // in construction.js
    this.helpers.ensureAnnotationImages();
    this.activeAnnotationId = null;
    this.acceptInput.deny();
    // Nudge IE to force the annotations to repaint.
    if (DV.jQuery.browser.msie) {
      this.elements.annotations.css({zoom : 0});
      this.elements.annotations.css({zoom : 1});
    }

    this.helpers.toggleContent('viewAnnotations');
    this.compiled.next();
    return true;
  },

  ViewDocument: function(){
    this.helpers.reset();
    this.helpers.addObserver('drawPages');
    this.dragReporter.setBinding();
    this.elements.window.mouseleave(DV.jQuery.proxy(this.dragReporter.stop, this.dragReporter));
    this.acceptInput.allow();

    this.helpers.toggleContent('viewDocument');

    this.helpers.setActiveChapter(this.models.chapters.getChapterId(this.models.document.currentIndex()));

    this.helpers.jump(this.models.document.currentIndex());
    return true;
  },

  ViewEntity: function(name, offset, length) {
    this.helpers.reset();
    this.helpers.toggleContent('viewSearch');
    this.helpers.showEntity(name, offset, length);
  },

  ViewSearch: function(){
    this.helpers.reset();

    if(this.elements.searchInput.val() == '') {
      this.elements.searchInput.val(searchRequest);
    } else {
      var searchRequest = this.elements.searchInput.val();
    }

    this.helpers.getSearchResponse(searchRequest);
    this.acceptInput.deny();

    this.helpers.toggleContent('viewSearch');

    return true;
  },

  ViewText: function(){
    this.helpers.reset();
    this.acceptInput.allow();
    this.pageSet.zoomText();
    this.helpers.toggleContent('viewText');
    this.events.loadText();
    return true;
  },

  ViewThumbnails: function() {
    this.helpers.reset();
    this.helpers.toggleContent('viewThumbnails');
    this.thumbnails = new DV.Thumbnails(this);
    this.thumbnails.render();
    return true;
  }

};
