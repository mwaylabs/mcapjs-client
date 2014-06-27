describe("mCAP.authentication", function () {

  var mCAPApplicationAttributes, mCAPAuthenticationAttributes, server, callback, authResponseDataSucc, serverSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
  mCAPAuthenticationAttributes = JSON.stringify(mCAP.authentication.attributes);

  beforeEach(function () {
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);

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
      }
    };

    serverSuccCallback = function (xhr) {
//      console.log(JSON.stringify(xhr, null, 10));
      var postData = JSON.parse(xhr.requestBody);

      xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(authResponseDataSucc));
    }
  });

  afterEach(function () {
    server.restore();
    // reset the baseurl
    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);
  });


  it("isAuthenticated definition", function () {
    expect(typeof mCAP.authentication.isAuthenticated === 'function').toBeTruthy();
    expect(mCAP.authentication.isAuthenticated().then).toBeDefined();
    expect(mCAP.authentication.isAuthenticated().fail).toBeDefined();
    expect(mCAP.authentication.isAuthenticated().always).toBeDefined();
  });

  it("isAuthenticated success", function () {

    mCAP.authentication.set('user', new mCAP.User({
      uuid: authResponseDataSucc.user.uuid
    }));

    server.respondWith(serverSuccCallback);

    mCAP.authentication.isAuthenticated().then(function () {
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);
  });

  it("isAuthenticated failure without any user", function () {

    server.respondWith(serverSuccCallback);

    mCAP.authentication.isAuthenticated().fail(function () {
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);
  });

  it("isAuthenticated failure with wrong uuid", function () {

    mCAP.authentication.set('user', new mCAP.User({
      uuid: '1234'
    }));

    server.respondWith(serverSuccCallback);

    mCAP.authentication.isAuthenticated().fail(function () {
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);
  });

});





















