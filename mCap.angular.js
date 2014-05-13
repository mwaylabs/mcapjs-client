(function () {

  'use strict';

  var Backbone = window.Backbone;

  angular.module('mCap', [])

    .run(function ($http) {

      if(!window.mCap){
        throw new Error('Please include Mcap libary');
      }

      var sync = Backbone.sync;

      Backbone.sync = function(method, model){
        return sync.apply(Backbone,arguments).then(function(){
          return model;
        });
      };

      Backbone.ajax = function (options) {

        // Ignore notifications for given response codes
        if(options.data) {
          var requestData = JSON.parse(options.data);
          options.ignoreHandleResponseCodes = requestData.ignoreHandleResponseCodes;
        }

        // Set HTTP Verb as 'method'
        options.method = options.type;
        // Use angulars $http implementation for requests
        return $http.apply(angular, [options]).then(options.success, options.error);
      };
    })

    .service('Collection',function(){
      return window.mCap.Collection;
    })

    .service('Model',function($rootScope){
      return window.mCap.Model.extend({
        set: function(){
          // Trigger digest cycle to make calls to set recognizable by angular
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }

          return Backbone.Model.prototype.set.apply(this, arguments);
        }
      });
    });

})();