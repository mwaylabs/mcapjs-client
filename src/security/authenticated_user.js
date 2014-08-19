/**
 * mCAP Authentication
 */
var UserPreferences = mCAP.Model.extend({
  setUserId: function (userId) {
    this.setEndpoint('gofer/security/rest/users/' + userId + '/preferences');
  },
  parse: function (attrs) {
    return attrs.data;
  },
  save: function () {
    return Backbone.ajax({
      url: _.result(this, 'url'),
      data: this.toJSON(),
      type: 'PUT'
    });
  }
});

var AuthenticatedUser = mCAP.User.extend({
  changePassword: function (oldPassword, newPassword) {
    return Backbone.ajax({
      url: '/gofer/security/rest/users/changePassword',
      params: {
        oldPassword: oldPassword,
        newPassword: newPassword,
        uuid: this.id
      },
      type: 'PUT'
    });
  },
  parse: function (attrs) {
    attrs = mCAP.User.prototype.parse.apply(this, arguments);
    this.get('preferences').set(attrs.preferences);
    delete attrs.preferences;
    return attrs;
  },
  set: function (obj) {
    if (obj.preferences) {
      obj.preferences = obj.preferences.toJSON ? obj.preferences.toJSON() : obj.preferences;
      this.get('preferences').set(obj.preferences);
      delete obj.preferences;
    }
    mCAP.User.prototype.set.apply(this, arguments);
  },
  initialize: function () {
    this.set('preferences', new UserPreferences());
    this.set('authenticated',false);
    this.once('change:uuid', function () {
      this.get('preferences').setUserId(this.id);
      this.set('authenticated',true);
    }, this);
  }
});

mCAP.private.UserPreferences = UserPreferences;
mCAP.private.AuthenticatedUser = AuthenticatedUser;