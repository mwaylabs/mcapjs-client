describe("mCAP.push.device", function () {

  it("Object definition: Devices", function () {

    expect(Devices).toBeDefined();

    expect(mCAP.push.devices).toBeDefined();
    expect(mCAP.Collection.prototype.isPrototypeOf(mCAP.push.devices)).toBeTruthy();
    expect(Backbone.Collection.prototype.isPrototypeOf(mCAP.push.devices)).toBeTruthy();

  });

  it("Object definition: Device", function () {

    expect(Device).toBeDefined();
    expect(Device.prototype.defaults).toBeDefined();
    expect(Device.prototype.defaults.providerType).toBeDefined();
    expect(Device.prototype.defaults.user).toBeDefined();
    expect(Device.prototype.defaults.vendor).toBeDefined();
    expect(Device.prototype.defaults.osVersion).toBeDefined();
    expect(Device.prototype.defaults.language).toBeDefined();
    expect(Device.prototype.defaults.country).toBeDefined();
    expect(Device.prototype.defaults.tags).toBeDefined();
    expect(Device.prototype.defaults.badge).toBeDefined();
    expect(Device.prototype.defaults.token).toBeDefined();

    var device = mCAP.push.devices.add({});

    expect(device.get('providerType')).toEqual(mCAP.MCAP);
    expect(device.get('user')).toEqual('');
    expect(device.get('osVersion')).toEqual('');
    expect(device.get('language')).toEqual('de');
    expect(device.get('country')).toEqual('DE');
    expect(device.get('vendor')).toEqual('');
    expect(device.get('tags')).toEqual(null);
    expect(device.get('badge')).toEqual(0);
    expect(device.get('token')).toEqual('');

  });


  it("Devices endpoint", function () {

    var baseUrl = 'http://www.mcap.com';
    mCAP.application.set('baseUrl', baseUrl);

    expect(mCAP.push.devices.url()).toEqual(baseUrl + '/push/api/v1/apps/devices');
    mCAP.push.set('uuid', '5854AE59-8642-4B05-BC71-72B76B4E81E8');
    expect(mCAP.push.devices.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/devices');
    mCAP.application.set('pushServiceApiVersion', 'v2');
    expect(mCAP.push.devices.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/devices');
    mCAP.push.set('uuid', '');
    mCAP.application.set('pushServiceApiVersion', '');
    expect(mCAP.push.devices.url()).toEqual(baseUrl + '/push/api/v1/apps/devices');

  });

});