describe("mCap.authentication", function () {

  var mCapApplicationAttributes, mCapAuthenticationAttributes, server, callback, loginResponseDataSucc, serverSuccCallback;

  mCapApplicationAttributes = JSON.stringify(mCap.application.attributes);
  mCapAuthenticationAttributes = JSON.stringify(mCap.authentication.attributes);

  beforeEach(function () {
    mCap.application.set('baseUrl', 'http://www.mcap.com');

    mCap.application.attributes = JSON.parse(mCapApplicationAttributes);
    mCap.authentication.attributes = JSON.parse(mCapAuthenticationAttributes);

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    loginResponseDataSucc = { "user": { "aclEntries": [ "8475877d-853a-4e62-8918-a54a99a6c298:rw" ], "uuid": "bdebbaf3-5bef-4b04-a7e6-4a95814f6da3", "name": "test", "givenName": "Max", "surname": "Mustermann", "organizationUuid": "0644e9bf-923d-4e4a-b232-edd9dcd27d23", "email": "m.nustermann@mcap.com", "lastLoggedTime": 1400168482517, "locked": false, "activated": true, "readonly": false, "version": 3818, "effectivePermissions": "*", "preferences": { "pageSize": "500" } }, "organization": { "uuid": "0644e9bf-923d-4e4a-b232-edd9dcd27d23", "aclEntries": [ "8475877d-853a-4e62-8918-a54a99a6c298:rw" ], "name": "M-Way Solutions", "uniqueName": "mway", "address": { "country": "Germany" }, "billingSettings": { "billingAddress": { "country": "Germany" }, "billingPerson": { "phone": [], "mobilePhone": [], "email": [] }, "currency": "EUR" }, "technicalPerson": { "phone": [], "mobilePhone": [], "email": [] }, "assetPath": "/organizations/mway", "reportLocaleString": "de_DE", "defaultRoles": [ "8475877d-853a-4e62-8918-a54a99a6c298" ], "version": 2, "effectivePermissions": "*" }, "roles": [
      { "name": "DEVELOPERS", "systemPermission": false },
      { "name": "M-WAY SOLUTIONS", "systemPermission": false },
      { "name": "USERS", "systemPermission": false },
      { "name": "ADMIN", "systemPermission": false }
    ]};

    serverSuccCallback = function (xhr) {
//      console.log(JSON.stringify(xhr, null, 10));
      var postData = JSON.parse(xhr.requestBody);

      expect(postData.username).toBe('m.mustermann');
      expect(postData.organization).toBe('org');
      expect(postData.password).toBe('pass');

      if (xhr.method == "POST" && xhr.url === mCap.authentication.url() + 'login') {
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(loginResponseDataSucc));
      }
    }
  });

  afterEach(function () {
    server.restore();
    // reset the baseurl
    mCap.application.attributes = JSON.parse(mCapApplicationAttributes);
    mCap.authentication.attributes = JSON.parse(mCapAuthenticationAttributes);
  });


  it("Login config with set authentication successful", function () {

    mCap.authentication.set('username', 'm.mustermann');
    mCap.authentication.set('organization', 'org');
    mCap.authentication.set('password', 'pass');

    server.respondWith(serverSuccCallback);

    mCap.authentication.login().then(function (data) {
      expect(mCap.authentication.get('username')).toBe('m.mustermann');
      expect(mCap.authentication.get('organization')).toBe('org');
      expect(mCap.authentication.get('password')).toBe('pass');
      callback(data);
    });

    server.respond();

    sinon.assert.calledWith(callback, loginResponseDataSucc);
    sinon.assert.calledOnce(callback);

  });

  it("Login config with login as options authentication successful", function () {

    server.respondWith(serverSuccCallback);

    mCap.authentication.login({
      username: 'm.mustermann',
      organization: 'org',
      password: 'pass'
    }).then(function (data) {
      callback(data);
      expect(mCap.authentication.get('username')).toBe('m.mustermann');
      expect(mCap.authentication.get('organization')).toBe('org');
      expect(mCap.authentication.get('password')).toBe('pass');
    });

    server.respond();

    sinon.assert.calledWith(callback, loginResponseDataSucc);
    sinon.assert.calledOnce(callback);
  });

  it("Login config with set username and organisation successful", function () {

    mCap.authentication.set('username', 'm.mustermann');
    mCap.authentication.set('organization', 'org');

    server.respondWith(serverSuccCallback);

    expect(mCap.authentication.get('password')).toBe('');

    mCap.authentication.login('pass').then(function (data) {
      expect(mCap.authentication.get('username')).toBe('m.mustermann');
      expect(mCap.authentication.get('organization')).toBe('org');
      expect(mCap.authentication.get('password')).toBe('');
      callback(data);
    });

    server.respond();

    sinon.assert.calledWith(callback, loginResponseDataSucc);
    sinon.assert.calledOnce(callback);

  });

});





















