var CurrentOrganization = mCAP.Organization.extend({

  sync: function(){
    var fetchArgs = arguments;
    if (!this.get('uuid')) {
      var dfd = new window.Backbone.$.Deferred();
      mCAP.currentOrganization.once('change:uuid', function () {
        this.initialize();
        mCAP.Organization.prototype.sync.apply(this, fetchArgs).then(
          function (rspModel) {
            dfd.resolve(rspModel);
          },
          function (rsp) {
            dfd.reject(rsp);
          });
      }, this);
      return dfd.promise();
    } else {
      return mCAP.Organization.prototype.sync.apply(this, arguments);
    }
  },

  initialize: function(){
    this.set('uuid', mCAP.currentOrganization.get('uuid'));
  }
});

mCAP.CurrentOrganization = CurrentOrganization;
