(function (root) {
  'use strict';

  var Application = mCap.Model.extend({

    defaults: {
      "baseUrl":  ""
    }

  });

  mCap.application = new Application();

  root.mCap.application = new Application();

}(this));