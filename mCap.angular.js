(function () {

  'use strict';

  var Backbone = window.Backbone;

  angular.module('mCap', [])

    .run(function ($http, $rootScope) {

      if (!window.mCap) {
        throw new Error('Please include Mcap libary');
      }

      var sync = Backbone.sync,
        modelSet = Backbone.Model.prototype.set;

      Backbone.sync = function (method, model) {
        return sync.apply(Backbone, arguments).then(function () {
          return model;
        });
      };

      Backbone.Model.prototype.set = function () {
        // Trigger digest cycle to make calls to set recognizable by angular
        if (!$rootScope.$$phase) {
          $rootScope.$apply();
        }

        return modelSet.apply(this, arguments);
      };

      Backbone.ajax = function (options) {

        // Ignore notifications for given response codes
        if (options.data) {
          var requestData = JSON.parse(options.data);
          options.ignoreHandleResponseCodes = requestData.ignoreHandleResponseCodes;
        }

        // Set HTTP Verb as 'method'
        options.method = options.type;
        // Use angulars $http implementation for requests
        return $http.apply(angular, [options]).then(options.success, options.error);
      };

    })

    .provider('mCapApplication', function () {

      var mCap = window.mCap;

      return {
        setBaseUrl: function (url) {
          mCap.application.setBaseUrl(url);
        },

        $get: function () {
          return window.mCap.application;
        }
      };
    })

    .service('mCap', function () {
      return window.mCap;
    })

    .service('mCapCollection', function (mCap) {
      return mCap.Collection;
    })

    .service('mCapModel', function ($rootScope, mCap) {
      return mCap.Model;
    });

})();