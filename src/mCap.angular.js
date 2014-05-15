(function (root, angular, Backbone) {

  'use strict';

  angular.module('mCap', [])

    .run(function ($http, $q) {

      if (!window.mCap) {
        throw new Error('Please include Mcap libary');
      }

      var sync = Backbone.sync;

      Backbone.ajax = function (options) {
        // Set HTTP Verb as 'method'
        options.method = options.type;

        var dfd = $q.defer();
        // Use angulars $http implementation for requests
        $q.when($http.apply(angular, [options])).then(function(resp){
          options.success(resp);
          dfd.resolve(resp);
        },function(resp){
          dfd.reject(resp);
          options.error(resp);
        });
        return dfd.promise;
      };

      Backbone.sync = function (method, model, options) {
        var dfd = $q.defer();
        sync.apply(Backbone, [method, model, options]).then(function () {
          dfd.resolve(model);
        },function(resp){
          dfd.reject(resp);
        });
        return dfd.promise;
      };
    })

    .provider('mCapApplication', function () {

      var mCap = window.mCap;

      return {
        setBaseUrl: function (url) {
          mCap.application.set('baseUrl',url);
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
      return mCap.Model.extend({
        set: function () {
          // Trigger digest cycle to make calls to set recognizable by angular
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }

          return Backbone.Model.prototype.set.apply(this, arguments);
        }
      });
    });

})(window, angular, Backbone);