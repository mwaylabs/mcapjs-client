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
  save: function (options) {
    return Backbone.ajax(_.extend({
      url: _.result(this, 'url'),
      data: this.toJSON(),
      type: 'PUT'
    }, options));
  }
});

var AuthenticatedUser = mCAP.User.extend({
  defaults: function(){
    return _.extend(mCAP.User.prototype.defaults,{
      authenticated: false
    });
  },
  prepare: function(){
    return{
      preferences: new UserPreferences()
    };
  },
  changePassword: function (oldPassword, newPassword) {
    return Backbone.ajax({
      url: this.url()+'/changePassword',
      params: {
        oldPassword: oldPassword,
        newPassword: newPassword
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
  set: function(obj){
    if(obj.preferences && !(obj.preferences instanceof UserPreferences) ){
      this.get('preferences').set(obj.preferences);
      delete obj.preferences;
    }
    return mCAP.User.prototype.set.apply(this,arguments);
  },
  initialize: function () {
    this.once('change:uuid', function () {
      this.get('preferences').setUserId(this.id);
      this.set('authenticated',true);
    }, this);
  }
});

mCAP.private.UserPreferences = UserPreferences;
mCAP.private.AuthenticatedUser = AuthenticatedUser;