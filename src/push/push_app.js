var PushApp = mCAP.Model.extend({

  endpoint: '/push/api/' + mCAP.application.get('pushServiceApiVersion') + '/apps/',

  idAttribute: 'uuid',

  defaults: {
    uuid: '',
    name: '',
    apnsProvider: null,
    gcmProvider: null,
    version: 0,
    effectivePermissions: '*'
  },

  tags: null,
  jobs: null,
  devices: null,

  initialize: function () {
    var that = this;
    var _url = function(){
      return that.url();
    };
    this.tags = new mCAP.Tags({
      url: _url
    });
    this.jobs = new mCAP.Jobs({
      url: _url
    });

    this.devices = new mCAP.Devices({
      url: _url
    });

    return mCAP.Model.prototype.initialize.apply(this, arguments);
  }

});

mCAP.PushApp = PushApp;