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

  //INCLUDE GLOBAL SETTINGS HERE
  // @include ./utils/utils.js
  // @include ./utils/request.js

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
  // @include ./security/organization.js
  // @include ./security/organizations.js
  // @include ./security/role.js
  // @include ./security/roles.js
  // @include ./security/member.js
  // @include ./security/members.js
  // @include ./security/group.js
  // @include ./security/groups.js

  root.mCAP = mCAP;

}(this, Backbone, $, _));
