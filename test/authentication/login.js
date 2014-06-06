describe("mCAP.authentication", function () {

  var mCAPApplicationAttributes, mCAPAuthenticationAttributes, server, callback, loginResponseDataSucc, serverSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
  mCAPAuthenticationAttributes = JSON.stringify(mCAP.authentication.attributes);

  beforeEach(function () {
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    loginResponseDataSucc = { "user": { "aclEntries": [ "8475877d-853a-4e62-8918-a54a99a6c298:rw" ], "uuid": "bdebbaf3-5bef-4b04-a7e6-4a95814f6da3", "name": "test", "givenName": "Max", "surname": "Mustermann", "organizationUuid": "0644e9bf-923d-4e4a-b232-edd9dcd27d23", "email": "m.nustermann@mcap.com", "lastLoggedTime": 1400168482517, "locked": false, "activated": true, "readonly": false, "version": 3818, "effectivePermissions": "*", "preferences": { "pageSize": "500" } }, "organization": { "uuid": "0644e9bf-923d-4e4a-b232-edd9dcd27d23", "aclEntries": [ "8475877d-853a-4e62-8918-a54a99a6c298:rw" ], "name": "M-Way Solutions", "uniqueName": "org", "address": { "country": "Germany" }, "billingSettings": { "billingAddress": { "country": "Germany" }, "billingPerson": { "phone": [], "mobilePhone": [], "email": [] }, "currency": "EUR" }, "technicalPerson": { "phone": [], "mobilePhone": [], "email": [] }, "assetPath": "/organizations/mway", "reportLocaleString": "de_DE", "defaultRoles": [ "8475877d-853a-4e62-8918-a54a99a6c298" ], "version": 2, "effectivePermissions": "*" }, "roles": [
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

      if (xhr.method == "POST" && xhr.url === mCAP.authentication.url() + 'login') {
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(loginResponseDataSucc));
      }
    }
  });

  afterEach(function () {
    server.restore();
    // reset the baseurl
    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);
  });


  it("Login config with set authentication successful", function () {

    mCAP.authentication.set('username', 'm.mustermann');
    mCAP.authentication.set('organization', 'org');
    mCAP.authentication.set('password', 'pass');

    server.respondWith(serverSuccCallback);

    mCAP.authentication.login().then(function (data) {
      expect(mCAP.authentication.get('username')).toBe('m.mustermann');
      expect(mCAP.authentication.get('organization')).toBe('org');
      expect(mCAP.authentication.get('password')).toBe('pass');
      delete data.attributes;
      callback(data);
    });

    server.respond();

    sinon.assert.calledWith(callback, loginResponseDataSucc);
    sinon.assert.calledOnce(callback);

  });

  it("Login config with login as options authentication successful", function () {

    server.respondWith(serverSuccCallback);

    mCAP.authentication.login({
      username: 'm.mustermann',
      organization: 'org',
      password: 'pass'
    }).then(function (data) {
      expect(mCAP.authentication.get('username')).toBe('m.mustermann');
      expect(mCAP.authentication.get('organization')).toBe('org');
      expect(mCAP.authentication.get('password')).toBe('pass');
      delete data.attributes;
      callback(data);
    });

    server.respond();

    sinon.assert.calledWith(callback, loginResponseDataSucc);
    sinon.assert.calledOnce(callback);
  });

  it("Login config with set username and organisation successful", function () {

    mCAP.authentication.set('username', 'm.mustermann');
    mCAP.authentication.set('organization', 'org');

    server.respondWith(serverSuccCallback);

    expect(mCAP.authentication.get('password')).toBe('');

    mCAP.authentication.login('pass').then(function (data) {
      expect(mCAP.authentication.get('username')).toBe('m.mustermann');
      expect(mCAP.authentication.get('organization')).toBe('org');
      expect(mCAP.authentication.get('password')).toBe('');
      delete data.attributes;
      callback(data);
    });

    server.respond();

    sinon.assert.calledWith(callback, loginResponseDataSucc);
    sinon.assert.calledOnce(callback);

  });

});





















