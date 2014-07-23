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

  //INCLUDE GLOBAL SETTINGS HERE
  // @include ./utils/globals.js
  // @include ./utils/utils.js
  // @include ./utils/request.js

  // INCLUDE PRIVATE VARS HERE
  // @include ./filter/filterable.js
  // @include ./selectable/selectable_collection.js
  // @include ./selectable/selectable_model.js
  // @include ./selectable/selectable_factory.js

  // INCLUDE mCAP PUBLIC VARS HERE
  // @include ./model/model.js
  // @include ./model/component.js
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

  // @include ./push/push_attribute_collection.js
  // @include ./push/device.js
  // @include ./push/devices.js
  // @include ./push/job.js
  // @include ./push/jobs.js
  // @include ./push/tags.js
  // @include ./push/apns_provider.js
  // @include ./push/push_app.js
  // @include ./push/push_apps.js
  // @include ./push/mcap_push.js
  // @include ./push/push_notification.js

  root.mCAP = mCAP;

}(this, Backbone, $, _));
