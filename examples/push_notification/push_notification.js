mCAP.application.set('baseUrl', 'http://localhost:8079');

pushNotification = new mCAP.PushNotification({
  senderId: '',
  pushServiceId: 'E46628FC-7BE9-478F-90C3-E4442A43331E',
  user: '',
  vendor: '',
  name: '',
  osVersion: '',
  language: '',
  country: '',
  badge: '',
  appPackageName: '',
  type: '',
  model: '',
  token: ''
});

pushNotification.register();

pushNotification.on('register', function(){
  log('register', arguments);
});

pushNotification.on('error', function(){
  log('error', arguments);
});

pushNotification.on('token', function(){
  log('token', arguments);
});

pushNotification.on('registerdevice', function(){
  log('registerdevice', arguments);
});

pushNotification.on('registerdeviceerror', function(){
  log('registerdeviceerror', arguments);
});

pushNotification.on('message', function(){
  log('message', arguments);
});

pushNotification.on('badge', function(){
  log('badge', arguments);
});

pushNotification.on('unknown', function(){
  log('unknown', arguments);
});