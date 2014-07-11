/**
 * The push app Model
 */
var PushApp = mCAP.Model.extend({

  /**
   * The endpoint of the API
   * @type {String}
   */
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

  /**
   * Tags collection
   */
  tags: null,

  /**
   * Jobs collection
   */
  jobs: null,

  /**
   * Device collection
   */
  devices: null,

  initialize: function () {
    // cache
    var that = this;
    // API to the collections to get the url they are based on
    var _url = function(){
      return that.url();
    };

    // give a url function to the constructor of the collections. The 'children' need the url to build their own one based on its 'parent'
    this.tags = new mCAP.Tags({
      url: _url
    });
    this.jobs = new mCAP.Jobs({
      url: _url
    });
    this.devices = new mCAP.Devices({
      url: _url
    });

    // call super
    return mCAP.Model.prototype.initialize.apply(this, arguments);
  }

});

mCAP.PushApp = PushApp;