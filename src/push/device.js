/**
 * Device Model
 */
var Device = mCAP.Model.extend({

  idAttribute: 'uuid',

  defaults: {
    'providerType': mCAP.MCAP,
    'user': '',
    'vendor': '',
    'name': '',
    'osVersion': '',
    'language': 'de',
    'country': 'DE',
    'tags': null,
    'badge': 0
  }

});

mCAP.Device = Device;
