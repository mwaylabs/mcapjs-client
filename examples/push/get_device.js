mCAP.push.devices.fetch().then(function(){
  log('got ' + mCAP.push.devices.models.length + ' devices');
  log(JSON.stringify(mCAP.push.devices.models, null, 3));
});