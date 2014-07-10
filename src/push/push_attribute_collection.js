var PushAppAttributeCollection = mCAP.Collection.extend({

  endpoint: '',

  push: null,

  setEndpoint: function (endpoint) {
    this.url = function () {
      return URI(this.push.url() + endpoint).normalize().toString();
    };
  },

  initialize: function (push) {
    this.push = push;
    return mCAP.Collection.prototype.initialize.apply(this, arguments);
  }

});

mCAP.PushAppAttributeCollection = PushAppAttributeCollection;