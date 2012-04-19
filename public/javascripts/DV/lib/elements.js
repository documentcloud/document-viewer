/**
 * @class  DV.Elements
 */
/**
 * @method constructor
 * @param viewer
 */
DV.Elements = function(viewer){
  this._viewer = viewer;
  var elements = DV.Schema.elements;
  for (var i=0, elemCount=elements.length; i < elemCount; i++) {
    this.getElement(elements[i]);
  }
};

/**
 * @method getElement
 * @param  {Object} elementQuery
 * @param  force
 */
DV.Elements.prototype.getElement = function(elementQuery,force){
  this[elementQuery.name] = this._viewer.$(elementQuery.query);
};
