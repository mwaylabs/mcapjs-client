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
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift('login');
      that.trigger.apply(that, args);
    });
  },

  logout: function () {
    var that = this;
    return this.save(null, {
      url: this.url() + 'logout'
    }).always(function () {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift('logout');
      that.trigger.apply(that, args);
    });
  },

  parse: function (data) {
    var attributes = {};
    if (data) {
      if (data.user) {
        attributes.user = new mCAP.User(data.user);
      }
      if (data.organization) {
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
      uuid = mCAP.authentication.get('user').get('uuid')
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

mCAP.authentication = new Authentication();
