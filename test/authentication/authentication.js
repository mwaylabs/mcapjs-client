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
    expect(mCAP.authentication.get('user').get('organization').get('uuid')).toBeUndefined();
    expect(mCAP.authentication.endpoint).toEqual('gofer/security/rest/auth/');
    expect(mCAP.authentication.url()).toEqual('http://www.mcap.com/gofer/security/rest/auth/');

    mCAP.application.set('baseUrl', applicationBaseUrl);

  });

  it('knows if it has a role it is asked for', function() {
    var user = new AuthenticatedUser({uuid: '09F40863-DD69-49AE-9F8C-C83EA3BCD6BA'});
    var groups = new mCAP.Groups([
      {
        'uuid':'GROUP_NAME_ONE'
      },
      {
        'uuid':'B39438E3-B60D-4C7B-BE95-B298C20883AC'
      }
    ]);

    user.set('groups', groups);

    expect(user.hasRoleWithUuid('GROUP_NAME_ONE')).toBe(true);
    expect(user.hasRoleWithUuid('GROUP_NAME_TWO')).toBe(false);
  });
});





















