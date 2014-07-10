var PushApps = mCAP.Collection.extend({

  endpoint: '/push/api/' + mCAP.application.get('pushServiceApiVersion') + '/apps/',

  model: mCAP.PushApp

});

mCAP.PushApps = PushApps;