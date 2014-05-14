(function (root) {
  'use strict';

  var User = mCap.Model.extend({

    defaults: {
      "uuid": "",
      "name": "",
      "salutation": null,
      "givenName": "",
      "surname": "",
      "position": null,
      "email": "",
      "phone": null,
      "country": null,
      "lastLoggedTime": 0,
      "passwordExpires": null,
      "locked": false,
      "activated": true,
      "version": null,
      "aclEntries": [],
      "preferences": {},
      "groups": [],
      "roles": []
    }

  });

  root.mCap.User = User;

}(this));