/*jshint unused:false */
var ModelSelectable = ModelSelectable || {},
    CollectionSelectable = CollectionSelectable || {};

_.extend(ModelSelectable.prototype, Backbone.Events);
_.extend(CollectionSelectable.prototype, Backbone.Events);

var SelectableFactory = function (instance, options) {
  if (instance instanceof Backbone.Model) {
    return new ModelSelectable(instance, options);
  } else if (instance instanceof Backbone.Collection) {
    return new CollectionSelectable(instance, options);
  } else {
    throw new Error('SelectableFactory: instance has to be either a model or a collection');
  }
};