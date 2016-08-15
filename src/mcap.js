(function (root, Backbone, $, _) {
  'use strict';

  var sync = Backbone.sync,
    mCAP = {};

  Backbone.$ = Backbone.$ || $;

  Backbone.$.ajaxSetup({
    // send cookies
    xhrFields: { withCredentials: true }
  });

  Backbone.sync = function (method, model, options) {
    if (_.isUndefined(options.wait)) {
      options.wait = true;
    }
    return sync.apply(Backbone, [method, model, options]);
  };

  mCAP.baseUrl = '';

  // @include ./utils/utils.js
  // @include ./utils/request.js

  // @include ./filter/filterable.js
  // @include ./selectable/selectable_collection.js
  // @include ./selectable/selectable_model.js
  // @include ./selectable/selectable_factory.js

  // @include ./model/model.js
  // @include ./collection/collection.js
  // @include ./collection/enumerable_collection.js

  // @include ./filter/filter.js

  root.mCAP = mCAP;

}(this, Backbone, $, _));
