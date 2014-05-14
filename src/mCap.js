var sync = Backbone.sync;

Backbone.sync = function (method, model, options) {
  if (_.isUndefined(options.wait)) {
    options.wait = true;
  }
  return sync.apply(Backbone, [method, model, options]);
};