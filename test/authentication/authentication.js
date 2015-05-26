describe("mCAP.authentication", function () {

  it("Object definition", function () {

    // cache the baseUrl
    var applicationBaseUrl = mCAP.application.get('baseUrl');
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    expect(Authentication).toBeDefined();
    expect(Authentication.prototype.defaults).toBeDefined();
    expect(Authentication.prototype.endpoint).toEqual('gofer/security/rest/auth/');


    expect(mCAP.authentication).toBeDefined();
    expect(mCAP.Model.prototype.isPrototypeOf(mCAP.authentication)).toBeTruthy();
    expect(Backbone.Model.prototype.isPrototypeOf(mCAP.authentication)).toBeTruthy();
    expect(mCAP.authentication.get('user').get('uuid')).toBeNull();
    expect(mCAP.authentication.get('user').get('organization').get('uuid')).toBeNull();
    expect(mCAP.authentication.endpoint).toEqual('gofer/security/rest/auth/');
    expect(mCAP.authentication.url()).toEqual('http://www.mcap.com/gofer/security/rest/auth/');

    mCAP.application.set('baseUrl', applicationBaseUrl);

  });

});





















