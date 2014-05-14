/*jshint unused:false */
var ModelSelectable = ModelSelectable || {},
    CollectionSelectable = CollectionSelectable || {};

var SelectableFactory = function (instance, options) {
  if (instance instanceof Backbone.Model) {
    return new ModelSelectable(instance, options);
  } else if (instance instanceof Backbone.Collection) {
    return new CollectionSelectable(instance, options);
  }
};