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
   * mCAP.authentication.login('pass').then(function(){};
   * mCAP.authentication.login({
      userName: 'm.mustermann',
      orgaName: 'org',
      password: 'pass'
    });
   *
   * mCAP.authentication.on('login', function(obj, err, errMsg){})
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
    }).always(function () {
      if (typeof options === 'string') {
        that.set('password', '');
      }
      // cast arguments to array
      var args = Array.prototype.slice.call(arguments, 0);
      // add the event name
      args.unshift('login');
      // trigger the event
      that.trigger.apply(that, args);
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
      // cast arguments to array
      var args = Array.prototype.slice.call(arguments, 0);
      // add the event name
      args.unshift('logout');
      // trigger the event
      that.trigger.apply(that, args);
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
      url: mCAP.application.get('baseUrl') + 'gofer/system/security/currentAuthorization'
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