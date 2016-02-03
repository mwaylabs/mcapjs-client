(function (root, angular, Backbone) {

  'use strict';

  angular.module('mCAP', [])

    .run([function () {

      if (!window.mCAP) {
        throw new Error('Please include mCAP libary');
      }


    }])

    .provider('mCAPApplication', function () {

      var mCAP = window.mCAP;

      return {
        setBaseUrl: function (url) {
          mCAP.application.set('baseUrl',url);
        },

        $get: function () {
          return window.mCAP.application;
        }
      };
    })

    .service('MCAPAuthentication', function(){
      return window.mCAP.Authentication;
    })

    .service('MCAPauthentication', function(){
      return window.mCAP.authentication;
    })

    .service('MCAPauthenticatedUser', function(){
      return window.mCAP.authenticatedUser;
    })

    .service('MCAPcurrentOrganization', function(){
      return window.mCAP.currentOrganization;
    })

    .service('MCAPCountries', function(){
      return window.mCAP.Countries;
    })

    .service('MCAPCurrentOrganization', function(){
      return window.mCAP.CurrentOrganization;
    })

    .service('MCAPOrganization', function(){
      return window.mCAP.Organization;
    })

    .service('MCAPOrganizations', function(){
      return window.mCAP.Organizations;
    })

    .service('MCAPUsers', function(){
      return window.mCAP.Users;
    })

    .service('MCAPUser', function(){
      return window.mCAP.User;
    })

    .service('MCAPRoles', function(){
      return window.mCAP.Roles;
    })

    .service('MCAPRole', function(){
      return window.mCAP.Role;
    })

    .service('MCAPGroups', function(){
      return window.mCAP.Groups;
    })

    .service('MCAPGroup', function(){
      return window.mCAP.Group;
    })

    .service('MCAPFilterHolder', function(){
      return window.mCAP.FilterHolder;
    })

    .service('MCAPFilterHolders', function(){
      return window.mCAP.FilterHolders;
    })

    .service('MCAP', function () {
      return window.mCAP;
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

    .service('MCAPPasscodePolicy', function () {
      return window.mCAP.PasscodePolicy;
    });


  (function(){
    var _$q;
    var _$http;
    var _sync = Backbone.sync;

    angular.module('mCAP').run(['$http', '$q', function($http, $q){
      _$q = $q;
      _$http = $http;
    }]);

    Backbone.sync = function (method, model, options) {
      var dfd = _$q.defer();
      _sync.apply(Backbone, [method, model, options]).then(function () {
        dfd.resolve(model);
      },function(resp){
        dfd.reject(resp);
      });
      return dfd.promise;
    };

    Backbone.ajax = function (options) {
      // Set HTTP Verb as 'method'
      options.method = options.type;

      var dfd = _$q.defer();
      // Use angulars $http implementation for requests
      _$http.apply(angular, [options]).then(function(resp){
        if(options.success && typeof options.success === 'function'){
          options.success(resp);
        }
        dfd.resolve(resp);
      },function(resp){
        if(options.error && typeof options.error === 'function'){
          options.error(resp);
        }
        dfd.reject(resp);
      });
      return dfd.promise;
    };

  }());

})(window, angular, Backbone);
