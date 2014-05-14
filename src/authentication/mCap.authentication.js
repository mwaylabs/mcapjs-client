(function (root) {
  'use strict';

  var Authentication = mCap.Model.extend({

    defaults: {
      user: null
    },

    endpoint: 'gofer/security/rest/login/',

    login: function () {
      return this.save().then(function(){

      }).fail(function(){

      });
    },

    logout: function () {

    }

  });

  root.mCap.authentication = new Authentication();

}(this));