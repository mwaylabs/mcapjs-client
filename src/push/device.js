/**
 * Device Model
 */
var Device = mCAP.Model.extend({

  idAttribute: 'uuid',

  defaults: {
    'providerType': mCAP.MCAP, // mCAP.GCM, mCAP.APNS
    'user': '',
    'vendor': '',
    'name': '',
    'osVersion': '',
    'language': 'de',
    'country': 'DE',
    'tags': null,
    'badge': 0,
    'appPackageName': null, // bundleIdentifier
    'type': null, // smartphone or tablet
    'appVersion': null,
    'model': null,
    'attributes': null, // string to string hashmap {"key": "value"}
    'token': ''
  }

});

mCAP.Device = Device;