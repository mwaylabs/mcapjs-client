/**
 * mCAP Authentication
 */
var UserPreferences = mCAP.Model.extend({
  hasPreferences: true,
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
    return _.extend(mCAP.User.prototype.defaults.apply(this,arguments),{
      authenticated: false
    });
  },
  prepare: function(){
    var user =  mCAP.User.prototype.prepare.apply(this,arguments);
    return _.extend(user,{
      preferences: new UserPreferences()
    });
  },
  changePassword: function (oldPassword, newPassword) {
    return window.mCAP.Utils.request({
      url: this.url()+'/changePassword',
      data: {
        password: oldPassword,
        newPassword: newPassword
      },
      instance: this,
      type: 'PUT'
    });
  },
  beforeSave: function(attrs){
    delete attrs.preferences;
    return mCAP.User.prototype.beforeSave.call(this,attrs);
  },
  set: function (key, val, options) {
    key = this.setReferencedCollections(key);
    return mCAP.User.prototype.set.apply(this, [key, val, options]);
  },
  setReferencedCollections: function (attr) {
    mCAP.User.prototype.setReferencedCollections.apply(this, [attr]);

    if (attr.preferences && !(attr.preferences instanceof mCAP.Model) && this.get('preferences')) {
      this.get('preferences').set(attr.preferences);
      this.get('preferences').hasPreferences = true;
      delete attr.preferences;
    }

    //special case for LDAP users
    if(attr.preferences === null){
      this.get('preferences').hasPreferences = false;
      delete attr.preferences;
    }

    if (attr.organization && !(attr.organization instanceof mCAP.Model) && this.get('organization')) {
      this.get('organization').set(attr.organization);
      delete attr.organization;
    }

    if (attr.organization === null){
      delete attr.organization;
    }

    return attr;
  },
  parse: function (resp) {
    var parsedResp = mCAP.User.prototype.parse.apply(this, [resp]);
    return this.setReferencedCollections(parsedResp);
  },
  initialize: function () {
    this.on('change:'+this.idAttribute, function (model) {
      if(model && model.id){
        this.get('preferences').setUserId(model.id);
        this.set('authenticated',true);
      }
    }, this);
  }
});

mCAP.private.UserPreferences = UserPreferences;
mCAP.private.AuthenticatedUser = AuthenticatedUser;
