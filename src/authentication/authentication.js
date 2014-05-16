var Authentication = mCap.Model.extend({

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

    return this.sync('create', this, {
      url: this.url() + 'login'
    }).always(function () {
      if (typeof options === 'string') {
        that.set('password', '');
      }
    });
  },

  logout: function () {
    return this.sync('create', this, {
      url: this.url() + 'logout'
    }).always(function () {
    });
  },

  parse: function (data) {
    var attributes = {};
    if (data) {
      if (data.user) {
        attributes.user = new mCap.User(data.user);
      }
    }
    return attributes;
  }

});

mCap.authentication = new Authentication();
