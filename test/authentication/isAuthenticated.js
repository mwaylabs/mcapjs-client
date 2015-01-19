describe("mCAP.authentication", function () {

  var mCAPApplicationAttributes, mCAPAuthenticationAttributes, server, callback, authResponseDataSucc, authResponseDataFail, serverAuthSuccCallback, serverFailSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
  mCAPAuthenticationAttributes = JSON.stringify(mCAP.authentication.attributes);

  beforeEach(function () {
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.set(JSON.parse(mCAPAuthenticationAttributes));

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    authResponseDataSucc = {
      "user": {
        "name": "max",
        "uuid": "0144e9bf-5bef-4b04-a7e6-4a95814f6da3",
        "salutation": "mr",
        "givenName": "Max",
        "surname": "Mustermann",
        "position": "Developer",
        "email": "test@test.com",
        "phone": "+0123456789",
        "country": "Germany",
        "preferences": {
          "pageSize": "500"
        }
      },
      "organization": {
        "name": "M-Way Solutions",
        "uuid": "0144e9bf-923d-4e4a-b232-edd9dcd27d23",
        "uniqueName": "mway"
      },
      roles: []
    };

    authResponseDataFail = {
      user: null,
      roles: [],
      organization: null
    };

    serverAuthSuccCallback = function (xhr) {
      var postData = JSON.parse(xhr.requestBody);

      xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(authResponseDataSucc));
    };

    serverAuthFailCallback = function (xhr) {
      var postData = JSON.parse(xhr.requestBody);

      xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(authResponseDataFail));
    };
  });

  afterEach(function () {
    server.restore();
    // reset the baseurl
    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.set(JSON.parse(mCAPAuthenticationAttributes));
  });


  it("isAuthenticated definition", function () {
    expect(typeof mCAP.authentication.isAuthenticated === 'function').toBeTruthy();
    expect(mCAP.authentication.isAuthenticated().then).toBeDefined();
    expect(mCAP.authentication.isAuthenticated().fail).toBeDefined();
    expect(mCAP.authentication.isAuthenticated().always).toBeDefined();
  });

  it("isAuthenticated success when session exists", function () {

    mCAP.authentication.set('user', new mCAP.private.AuthenticatedUser({
      uuid: authResponseDataSucc.user.uuid
    }));

    server.respondWith(serverAuthSuccCallback);

    mCAP.authentication.isAuthenticated().then(function () {
      expect(mCAP.authentication.get('authenticated')).toBeTruthy();
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);
  });

  it("isAuthenticated failure when no session exists", function () {

    server.respondWith(serverAuthFailCallback);

    mCAP.authentication.isAuthenticated().fail(function () {
      callback(true);
      expect(mCAP.authentication.get('authenticated')).toBeFalsy();
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);
  });

});





















