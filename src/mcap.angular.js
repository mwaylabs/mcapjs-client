(function (root, angular) {

  'use strict';

  angular.module('mCAP', [])
    .service('MCAPCollection', function () {
      return window.mCAP.Collection;
    })

    .service('MCAPEnumerableCollection', function () {
      return window.mCAP.EnumerableCollection;
    })

    .service('MCAPModel', function () {
      return window.mCAP.Model;
    });

})(window, angular);
