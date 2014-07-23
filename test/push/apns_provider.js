describe("mCAP.ApnsProvider", function () {

  it("Object definition: ApnsProvider", function () {
    expect(ApnsProvider).toBeDefined();
    expect(mCAP.ApnsProvider).toBeDefined();
    expect(mCAP.Model.prototype.isPrototypeOf(mCAP.push.apnsProvider)).toBeTruthy();
    expect(Backbone.Model.prototype.isPrototypeOf(mCAP.push.apnsProvider)).toBeTruthy();

    expect(mCAP.ApnsProvider.prototype.defaults).toBeDefined();
    expect(mCAP.ApnsProvider.prototype.defaults.passphrase).toBeDefined();
    expect(mCAP.ApnsProvider.prototype.defaults.certificate).toBeDefined();


    expect(mCAP.push.apnsProvider).toBeDefined();
    expect(mCAP.push.apnsProvider.attributes).toBeDefined();
    expect(mCAP.push.apnsProvider.attributes.passphrase).toBeDefined();
    expect(mCAP.push.apnsProvider.attributes.certificate).toBeDefined();


    var example = new mCAP.ApnsProvider();
    expect(example.get('passphrase')).toEqual(null);
    expect(example.get('certificate')).toEqual(null);

  });


  it("ApnsProvider endpoint", function () {

    var baseUrl = 'http://www.mcap.com';
    mCAP.application.set('baseUrl', baseUrl);

    expect(mCAP.push.apnsProvider.url()).toEqual(baseUrl + '/push/api/v1/apps/apnsProvider');
    mCAP.push.set('uuid', '5854AE59-8642-4B05-BC71-72B76B4E81E8');
    expect(mCAP.push.apnsProvider.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/apnsProvider');
    mCAP.application.set('pushServiceApiVersion', 'v2');
    expect(mCAP.push.apnsProvider.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/apnsProvider');
    mCAP.push.set('uuid', '');
    mCAP.application.set('pushServiceApiVersion', '');
    expect(mCAP.push.apnsProvider.url()).toEqual(baseUrl + '/push/api/v1/apps/apnsProvider');

  });

  xit("ApnsProvider formdata upload test", function () {

    // TODO

  });

  xit("ApnsProvider formdata upload and update the push apnsProvider attributes", function () {

    // TODO see:
    // return Backbone.sync.call(this, method, model, options).then(function(attributes){
    // update the apns provider details after saving
    //model.push.update(attributes);
    //return arguments;
    //});

  });

});