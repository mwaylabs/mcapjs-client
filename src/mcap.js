(function (root, Backbone, $, _) {
  'use strict';

  var sync = Backbone.sync,
    mCAP = {};

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

  // INCLUDE PRIVATE VARS HERE
  // @include ./filter/filterable.js
  // @include ./selectable/selectable_collection.js
  // @include ./selectable/selectable_model.js
  // @include ./selectable/selectable_factory.js

  // INCLUDE mCAP PUBLIC VARS HERE
  // @include ./model/model.js
  // @include ./collection/collection.js
  // @include ./filter/filter.js
  // @include ./application/application.js
  // @include ./security/authentication.js
  // @include ./security/user.js
  // @include ./security/users.js
  // @include ./security/group.js
  // @include ./security/groups.js

  root.mCAP = mCAP;

}(this, Backbone, $, _));
