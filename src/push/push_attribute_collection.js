/**
 * Base object collection for all push collections
 */
var PushAppAttributeCollection = mCAP.Collection.extend({

  endpoint: '',

  /**
   * The push app API
   * @type {Object}
   */
  push: null,

  setEndpoint: function (endpoint) {
    this.url = function () {
      // take the 'parent' url and append the own endpoint
      return URI(this.push.url() + endpoint).normalize().toString();
    };
  },

  /**
   * The push param needs to implement an url function. This is needed to build the own URL of the Collection.
   * @param push
   * @returns {*}
   */
  initialize: function (child, push) {
    this.push = push;
    return mCAP.Collection.prototype.initialize.apply(this, arguments);
  }

});

mCAP.PushAppAttributeCollection = PushAppAttributeCollection;