/**
 * Device Collection
 */
var Devices = mCAP.PushAppAttributeCollection.extend({

  endpoint: '/devices',

  model: mCAP.Device,

  parse: function (data) {
    if (data && data.items) {
      return data.items;
    }
    return data;
  }
});

mCAP.Devices = Devices;