var pushAppCollection = new mCAP.PushApps({

});

pushAppCollection.fetch().then(function(){
  log('get push app(s)', JSON.stringify(pushAppCollection.models, null, 3));
});