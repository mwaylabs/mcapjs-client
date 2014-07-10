var PushApps = mCAP.Collection.extend({

  endpoint: 'push/api/' + mCAP.application.get('pushServiceApiVersion') + '/apps/',

  model: mCAP.PushApp,

  parse: function(data){
    if(data && data.items){
      return data.items;
    }
    return data;
  }

});

mCAP.PushApps = PushApps;