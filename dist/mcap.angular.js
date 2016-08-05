(function (root, angular, Backbone) {

  'use strict';

  (function () {
    var _$q;
    var _$http;
    var _sync = Backbone.sync;

    angular.module('mCAP', [])

      .service('MCAPFilterHolder', function () {
        return window.mCAP.FilterHolder;
      })

      .service('MCAPFilterHolders', function () {
        return window.mCAP.FilterHolders;
      })

      .service('MCAPCollection', function () {
        return window.mCAP.Collection;
      })

      .service('MCAPEnumerableCollection', function () {
        return window.mCAP.EnumerableCollection;
      })

      .service('MCAPModel', function () {
        return window.mCAP.Model;
      })

      .run(function ($http, $q) {
        _$q = $q;
        _$http = $http;
      });

    Backbone.sync = function (method, model, options) {
      var dfd = _$q.defer();
      _sync.apply(Backbone, [method, model, options]).then(function () {
        dfd.resolve(model);
      }, function (resp) {
        dfd.reject(resp);
      });
      return dfd.promise;
    };

    Backbone.ajax = function (options) {
      // Set HTTP Verb as 'method'
      options.method = options.type;

      var dfd = _$q.defer();
      // Use angulars $http implementation for requests
      _$http.apply(angular, [options]).then(function (resp) {
        if (options.success && typeof options.success === 'function') {
          options.success(resp);
        }
        dfd.resolve(resp);
      }, function (resp) {
        if (options.error && typeof options.error === 'function') {
          options.error(resp);
        }
        dfd.reject(resp);
      });
      return dfd.promise;
    };

  }());

})(window, angular, Backbone);
