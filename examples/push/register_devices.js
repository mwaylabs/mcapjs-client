// register Device
var device = mCAP.push.devices.add({
  "providerType" : "MCAP",
  "user" : "m.mustermann",
  "vendor" : "Samsung",
  "name" : "S3",
  "osVersion" : "4.0.2",
  "language" : "de",
  "country" : "DE",
  "tags" : [
    "myTag",
    "myTag2"
  ],
  "badge" : 0
});

device.save().then(function(){
  log('registered Device', JSON.stringify(device, null, 3));
});