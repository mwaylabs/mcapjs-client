var Authentication = mCAP.Model.extend({

  defaults: {
    'username': '',
    'organization': '',
    'password': ''
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
    });
  },

  logout: function () {
    return this.save(null, {
      url: this.url() + 'logout'
    }).always(function () {

    });
  },

  parse: function (data) {
    var attributes = {};
    if (data) {
      if (data.user) {
        attributes.user = new mCAP.User(data.user);
      }
    }
    return attributes;
  }

});

mCAP.authentication = new Authentication();
