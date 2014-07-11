/**
 * mCAP Authentication
 */
var Authentication = mCAP.Model.extend({

  defaults: {
    'userName': '',
    'orgaName': '',
    'password': '',
    'email': '',
    'organization': null,
    'user': null
  },

  endpoint: 'gofer/security/rest/auth/',

  /**
   * Perform a login request against the server configured with mCAP.application.set('baseUrl', 'https://server.com');
   * Fires a login event everytime a login is performed. Even if the login was not successful.
   * @param options - Can either be a string for the password or an object with credentials.
   * @returns promise
   * @example
   *
   * // login with password
   * mCAP.authentication.login('pass').then(function(){};
   * // login with credentials
   * mCAP.authentication.login({
      userName: 'm.mustermann',
      orgaName: 'org',
      password: 'pass'
    });
   * // event when auth was successful
   * mCAP.authentication.on('login', function(){})
   * // event when auth was not successful
   * mCAP.authentication.on('authenticationerror', function(obj, err, errMsg){})
   */
  login: function (options) {
    var that = this;
    if (typeof options === 'string') {
      this.set('password', options);
    } else if (typeof options === 'object') {
      this.set(options);
    }
    return this.save(null, {
      url: this.url() + 'login'
    }).then(function(){
      // trigger login on successful login
      that._triggerEvent('login', arguments);
      return arguments[0];
    }).fail(function(){
      // trigger loginerror on authentication error
      that._triggerEvent('authenticationerror', arguments);
      return arguments;
    }).always(function () {
      if (typeof options === 'string') {
        that.set('password', '');
      }
      return arguments;
    });
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

  /**
   * Takes the arguments from the server and builds objects needed on the client side
   * @private
   * @param data
   * @returns {{}}
   */
  parse: function (data) {
    var attributes = {};
    if (data) {
      if (data.user) {
        // build a user
        attributes.user = new mCAP.User(data.user);
      }
      if (data.organization) {
        // build a organization
        attributes.organization = new mCAP.Organization(data.organization);
      }
    }
    return attributes;
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
    var uuid = null;
    // check if there was a login before
    if(mCAP.authentication.get('user') && mCAP.authentication.get('user').get('uuid')){
      uuid = mCAP.authentication.get('user').get('uuid');
    } else {
      dfd.reject('no user set');
      return dfd.promise();
    }

    mCAP.Utils.request({
      url: URI(mCAP.application.get('baseUrl') + '/gofer/system/security/currentAuthorization').normalize().toString()
    }).then(function (data) {
      // resolve only if the current user is authenticated
      if (data.user && data.user.uuid && data.user.uuid === uuid) {
        dfd.resolve(data);
      }
      // otherwise reject
      dfd.reject('not authenticated', data);
      return;
    }).fail(function (err) {
      dfd.reject(err);
    });
    return dfd.promise();
  }

});

// API
mCAP.authentication = new Authentication();