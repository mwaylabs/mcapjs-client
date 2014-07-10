describe("mCAP.push.tags", function () {

  it("Object definition: Tags", function () {

    expect(Tags).toBeDefined();

    expect(mCAP.push.tags).toBeDefined();
    expect(mCAP.Collection.prototype.isPrototypeOf(mCAP.push.tags)).toBeTruthy();
    expect(Backbone.Collection.prototype.isPrototypeOf(mCAP.push.tags)).toBeTruthy();

  });


  it("Tags endpoint", function () {

    var baseUrl = 'http://www.mcap.com';
    mCAP.application.set('baseUrl', baseUrl);

    expect(mCAP.push.tags.url()).toEqual(baseUrl + '/push/api/v1/apps/tags');
    mCAP.application.set('pushService', '5854AE59-8642-4B05-BC71-72B76B4E81E8');
    expect(mCAP.push.tags.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/tags');
    mCAP.application.set('pushServiceApiVersion', 'v2');
    expect(mCAP.push.tags.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/tags');
    mCAP.application.set('pushService', '');
    mCAP.application.set('pushServiceApiVersion', '');
    expect(mCAP.push.tags.url()).toEqual(baseUrl + '/push/api/v1/apps/tags');

  });

});