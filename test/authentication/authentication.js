describe("mCAP.authentication", function () {

  it("Object definition", function () {

    // cache the baseUrl
    var applicationBaseUrl = mCAP.application.get('baseUrl');
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    expect(Authentication).toBeDefined();
    expect(Authentication.prototype.defaults).toBeDefined();
    expect(Authentication.prototype.defaults.userName).toBeDefined();
    expect(Authentication.prototype.defaults.orgaName).toBeDefined();
    expect(Authentication.prototype.defaults.password).toBeDefined();
    expect(Authentication.prototype.endpoint).toEqual('gofer/security/rest/auth/');
    expect(Authentication.prototype.hasOwnProperty('login')).toBeTruthy();
    expect(Authentication.prototype.hasOwnProperty('logout')).toBeTruthy();
    expect(Authentication.prototype.hasOwnProperty('parse')).toBeTruthy();


    expect(mCAP.authentication).toBeDefined();
    expect(mCAP.Model.prototype.isPrototypeOf(mCAP.authentication)).toBeTruthy();
    expect(Backbone.Model.prototype.isPrototypeOf(mCAP.authentication)).toBeTruthy();
    expect(mCAP.authentication.get('userName')).toEqual('');
    expect(mCAP.authentication.get('orgaName')).toEqual('');
    expect(mCAP.authentication.get('password')).toEqual('');
    expect(mCAP.authentication.endpoint).toEqual('gofer/security/rest/auth/');
    expect(mCAP.authentication.url()).toEqual(mCAP.application.get('baseUrl') + '/gofer/security/rest/auth/');

    expect(typeof mCAP.authentication.login).toEqual('function');
    expect(mCAP.authentication.hasOwnProperty('login')).toBeFalsy();
    expect(typeof mCAP.authentication.logout).toEqual('function');
    expect(mCAP.authentication.hasOwnProperty('logout')).toBeFalsy();
    expect(typeof mCAP.authentication.parse).toEqual('function');
    expect(mCAP.authentication.hasOwnProperty('parse')).toBeFalsy();

    mCAP.application.set('baseUrl', applicationBaseUrl);

  });

});





















