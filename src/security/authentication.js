var Authentication = mCAP.Model.extend({

  defaults: {
    'user': null
  },

  endpoint: 'gofer/security/rest/auth/',

  prepare: function () {
    return {
      user: new mCAP.private.AuthenticatedUser()
    };
  },

  /**
   * Perform a logout request against the server configured with mCAP.application.set('baseUrl', 'https://server.com');
   * Fires a logout event everytime a login is performed.
   * @returns promise
   * @example
   * mCAP.authentication.logout().always(function(){});
   * mCAP.authentication.on('logout', function(obj){});
   */
  logout: function () {
    var that = this;
    return this.save(null, {
      url: this.url() + 'logout'
    }).always(function () {
      that._triggerEvent('logout', arguments);
    });
  },

  setReferencedModels: function (obj) {
    if (obj.user && !(obj.user instanceof mCAP.private.AuthenticatedUser) && this.get('user')) {
      this.get('user').set(obj.user);
      delete obj.user;
    }

    if (obj.organization && !(obj.organization instanceof mCAP.Organization) && this.get('user')) {
      this.get('user').get('organization').set(obj.organization);
      delete obj.organization;
    }
    return obj;
  },

  /**
   * Takes the arguments from the server and builds objects needed on the client side
   * @private
   * @param data
   * @returns {{}}
   */
  parse: function (data) {
    return this.setReferencedModels(data);
  },

  set: function (key, val, options) {
    key = this.setReferencedModels(key);
    return mCAP.Model.prototype.set.apply(this, [key, val, options]);
  },

  /**
   * Check if the current user is authenticated or not. Resolves if it is the case otherwise its rejected.
   * @returns {promise}
   * @example
   * mCAP.authentication.isAuthenticated().then(function(){
            console.log('is authenticated');
        }).fail(function(){
            console.log('is not authenticated');
        });
   */
  isAuthenticated: function () {
    var dfd = $.Deferred();

    mCAP.Utils.request({
      url: URI(mCAP.application.get('baseUrl') + '/gofer/system/security/currentAuthorization').normalize().toString()
    }).then(function (data) {
      // resolve only if the current user is authenticated
      if (data.user && data.user.uuid) {
        dfd.resolve(data);
      }
      // otherwise reject
      dfd.reject('not authenticated', data);
      return;
    }).fail(function (err) {
      dfd.reject(err);
    });
    return dfd.promise();
  },

  initialize: function () {
//    this.on('change', function () {
//      mCAP.authenticatedUser.set(this.get('user'));
//    },this);
  }

}, {
  requestNewPassword: function (userName, organizationName) {
    return Backbone.ajax({
      url: '/gofer/security/rest/users/createPasswordResetRequest',
      params: {
        userIdentifier: userName,
        organizationName: organizationName
      },
      type: 'PUT'
    });
  },
  resetPassword: function (userIdentifier, organizationName, newPassword, requestUuid) {
    return Backbone.ajax({
      url: '/gofer/security/rest/users/resetPassword',
      params: {
        newPassword: newPassword,
        organizationName: organizationName,
        requestUuid: requestUuid,
        userIdentifier: userIdentifier
      },
      type: 'PUT'
    });
  },
  login: function (userName, password, organizationName) {
    return Backbone.ajax({
      url: this.prototype.endpoint+'login',
      data: {
        'userName': (organizationName ? organizationName + '\\' : '') + userName,
        'password': password
      },
      type: 'POST'
    }).then(function (response) {
      var data = response.data,
        user = mCAP.authentication.get('user');

      user.set(data.user);
      user.get('groups').add(data.roles.roles);
      user.set('organization', data.organization);
      return mCAP.authentication;
    });
  }
});

// API
mCAP.authentication = new Authentication();
mCAP.Authentication = Authentication;
mCAP.authenticatedUser = mCAP.authentication.get('user');
mCAP.currentOrganization = mCAP.authentication.get('user').get('organization');

Authentication.prototype.initialize = function () {
  throw new Error('You can not instantiate a second Authentication object please use the mCAP.authentication instance');
};
