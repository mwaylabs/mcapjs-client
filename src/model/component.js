/**
 * The Component Model - extends the mCAP.Model with a version number
 */
var Component = mCAP.Model.extend({

  endpoint: '/',

  defaults: {
    uuid: null,
    version: -1
  },

  increaseVersionNumber: function () {
    this.attributes.version += 1;
  },

  decreaseVersionNumber: function () {
    this.attributes.version -= 1;
  },

  /**
   * Update version number on save
   * @param key
   * @param val
   * @param options
   * @returns {Array}
   * @private
   */
  _save: function (key, val, options) {
    // prepare options
    // needs to be == not === because backbone has the same check. If key is undefined the check will fail with === but jshint does not allow == so this is the workaround to   key == null || typeof key === 'object'
    if (typeof key === 'undefined' || key === void 0 || key === null || typeof key === 'object') {
      options = val;
    }
    // make sure options are defined
    options = _.extend({validate: true}, options);
    // cache success
    var error = options.error;
    // cache model
    var model = this;

    model.increaseVersionNumber();
    // overwrite error
    options.error = function (resp) {
      model.decreaseVersionNumber();
      // call cached success
      if (error) {
        error(model, resp, options);
      }
    };

    // make sure options are the correct paramater
    // needs to be == not === because backbone has the same check. If key is undefined the check will fail with === but jshint does not allow == so this is the workaround to   key == null || typeof key === 'object'
    if (typeof key === 'undefined' || key === void 0 || key === null || typeof key === 'object') {
      val = options;
    }
    return mCAP.Model.prototype._save.call(this, key, val, options);
  }

});

mCAP.Component = Component;