describe("mCAP.push", function () {
  it("Object definition: Push", function () {

    expect(mCAP.PushApp).toBeDefined();
    expect(mCAP.PushApp.prototype.defaults.name).toBeDefined();
    expect(mCAP.PushApp.prototype.defaults.gcmProvider).toBeDefined();
    expect(mCAP.PushApp.prototype.defaults.version).toBeDefined();
    expect(mCAP.PushApp.prototype.defaults.effectivePermissions).toBeDefined();

    expect(PushApp.prototype.hasOwnProperty('devices')).toBeTruthy();
    expect(PushApp.prototype.hasOwnProperty('jobs')).toBeTruthy();
    expect(PushApp.prototype.hasOwnProperty('tags')).toBeTruthy();

    expect(mCAP.push).toBeDefined();
    expect(mCAP.Model.prototype.isPrototypeOf(mCAP.push)).toBeTruthy();
    expect(Backbone.Model.prototype.isPrototypeOf(mCAP.push)).toBeTruthy();

    var push = new mCAP.PushApp();
    var push1 = new mCAP.PushApp();
    expect(push.tags === push.tag).toBeFalsy();

    expect(push.endpoint).toBeDefined();
    expect(mCAP.push.endpoint).toBeDefined();
    expect(push.endpoint).toEqual('/push/api/v1/apps/');

  });

  it("Object definition: Collections", function () {

    var baseUrl = 'http://www.mcap.com';
    mCAP.application.set('baseUrl', baseUrl);

    expect(mCAP.push.url()).toEqual(baseUrl + '/push/api/v1/apps/');
    expect(mCAP.push.tags.url()).toEqual(baseUrl + '/push/api/v1/apps/tags');
    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/jobs');
    expect(mCAP.push.devices.url()).toEqual(baseUrl + '/push/api/v1/apps/devices');

    var uuid = '1234-5678-9009';
    mCAP.push.set('uuid', uuid);
    expect(mCAP.push.url()).toEqual(baseUrl + '/push/api/v1/apps/' + uuid);
    expect(mCAP.push.tags.url()).toEqual(baseUrl + '/push/api/v1/apps/' +  uuid +'/tags');
    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/' +  uuid +'/jobs');
    expect(mCAP.push.devices.url()).toEqual(baseUrl + '/push/api/v1/apps/' +  uuid +'/devices');

  });

});