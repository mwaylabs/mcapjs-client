/**
 * The push app Model
 */
var PushApp = mCAP.Component.extend({

  /**
   * The endpoint of the API
   * @type {String}
   */
  endpoint: 'push/api/' + mCAP.application.get('pushServiceApiVersion') + '/apps/',

  idAttribute: 'uuid',

  defaults: {
    uuid: null,
    name: '',
    apnsProvider: null,
    // example this.set('gcmProvider', {apiKey: ''});
    gcmProvider: null,
    version: -1,
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
    var _url = function () {
      return that.url();
    };

    /**
     * Interface to update the apnsProvider data after uploading a file
     * @param data
     * @returns {*}
     * @private
     */
    var _updateApnsProvider = function(data){
      return that.set('apnsProvider', data);
    };

    // give a url function to the constructor of the collections. The 'children' need the url to build their own one based on its 'parent'
    this.tags = new mCAP.Tags(null, {
      url: _url
    });
    this.jobs = new mCAP.Jobs(null, {
      url: _url
    });
    this.devices = new mCAP.Devices(null, {
      url: _url
    });
    this.apnsProvider = new mCAP.ApnsProvider(null, {
      url: _url,
      update: _updateApnsProvider
    });

    // call super
    return mCAP.Model.prototype.initialize.apply(this, arguments);
  },

  fetch: function () {
    return $.when(this.devices.fetch(), this.tags.fetch(), this.jobs.fetch(), mCAP.Model.prototype.fetch.apply(this, arguments));
  }

});

mCAP.PushApp = PushApp;