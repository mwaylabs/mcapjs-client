/**
 * The push app collection
 */
var PushApps = mCAP.Collection.extend({

  /**
   * The endpoint of the API
   * @type {String}
   */
  endpoint: 'push/api/' + mCAP.application.get('pushServiceApiVersion') + '/apps/',

  /**
   * The model
   * @type {mCAP.PushApp}
   */
  model: mCAP.PushApp,

  /**
   * Returns the data from the server
   * @param data
   * @returns {*}
   */
  parse: function(data){
    if(data && data.items){
      return data.items;
    }
    return data;
  }

});

mCAP.PushApps = PushApps;