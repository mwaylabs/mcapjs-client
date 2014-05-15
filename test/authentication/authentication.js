describe("mCap.authentication", function () {

  it("Object definition", function () {

    // cache the baseUrl
    var applicationBaseUrl = mCap.application.get('baseUrl');
    mCap.application.set('baseUrl', 'http://www.mcap.com');

    expect(Authentication).toBeDefined();
    expect(Authentication.prototype.defaults).toBeDefined();
    expect(Authentication.prototype.defaults.username).toBeDefined();
    expect(Authentication.prototype.defaults.organization).toBeDefined();
    expect(Authentication.prototype.defaults.password).toBeDefined();
    expect(Authentication.prototype.endpoint).toEqual('gofer/security/rest/auth/');
    expect(Authentication.prototype.hasOwnProperty('login')).toBeTruthy();
    expect(Authentication.prototype.hasOwnProperty('logout')).toBeTruthy();
    expect(Authentication.prototype.hasOwnProperty('parse')).toBeTruthy();


    expect(mCap.authentication).toBeDefined();
    expect(mCap.Model.prototype.isPrototypeOf(mCap.authentication)).toBeTruthy();
    expect(Backbone.Model.prototype.isPrototypeOf(mCap.authentication)).toBeTruthy();
    expect(mCap.authentication.get('username')).toEqual('');
    expect(mCap.authentication.get('organization')).toEqual('');
    expect(mCap.authentication.get('password')).toEqual('');
    expect(mCap.authentication.endpoint).toEqual('gofer/security/rest/auth/');
    expect(mCap.authentication.url()).toEqual(mCap.application.get('baseUrl') + '/gofer/security/rest/auth/');

    expect(typeof mCap.authentication.login).toEqual('function');
    expect(mCap.authentication.hasOwnProperty('login')).toBeFalsy();
    expect(typeof mCap.authentication.logout).toEqual('function');
    expect(mCap.authentication.hasOwnProperty('logout')).toBeFalsy();
    expect(typeof mCap.authentication.parse).toEqual('function');
    expect(mCap.authentication.hasOwnProperty('parse')).toBeFalsy();

    mCap.application.set('baseUrl', applicationBaseUrl);

  });

});