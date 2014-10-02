describe("mCAP.authentication", function () {

  var mCAPApplicationAttributes, mCAPAuthenticationAttributes, server, callback, loginResponseDataSucc, serverSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
  mCAPAuthenticationAttributes = JSON.stringify(mCAP.authentication.attributes);

  beforeEach(function () {
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.set(JSON.parse(mCAPAuthenticationAttributes));

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    loginResponseDataSucc = { "user": { "aclEntries": [ "8475877d-853a-4e62-8918-a54a99a6c298:rw" ], "uuid": "bdebbaf3-5bef-4b04-a7e6-4a95814f6da3", "name": "test", "givenName": "Max", "surname": "Mustermann", "organizationUuid": "0644e9bf-923d-4e4a-b232-edd9dcd27d23", "email": "m.nustermann@mcap.com", "lastLoggedTime": 1400168482517, "locked": false, "activated": true, "readonly": false, "version": 3818, "effectivePermissions": "*", "preferences": { "pageSize": "500" } }, "organization": { "uuid": "0644e9bf-923d-4e4a-b232-edd9dcd27d23", "aclEntries": [ "8475877d-853a-4e62-8918-a54a99a6c298:rw" ], "name": "M-Way Solutions", "uniqueName": "org", "address": { "country": "Germany" }, "billingSettings": { "billingAddress": { "country": "Germany" }, "billingPerson": { "phone": [], "mobilePhone": [], "email": [] }, "currency": "EUR" }, "technicalPerson": { "phone": [], "mobilePhone": [], "email": [] }, "assetPath": "/organizations/mway", "reportLocaleString": "de_DE", "defaultRoles": [ "8475877d-853a-4e62-8918-a54a99a6c298" ], "version": 2, "effectivePermissions": "*" }, "roles": [
      { "name": "DEVELOPERS", "systemPermission": false },
      { "name": "M-WAY SOLUTIONS", "systemPermission": false },
      { "name": "USERS", "systemPermission": false },
      { "name": "ADMIN", "systemPermission": false }
    ]};

    serverSuccCallback = function (xhr) {
      var postData = JSON.parse(xhr.requestBody);

      expect(postData.userName).toBe('m.mustermann');
      expect(postData.orgaName).toBe('org');

      if (xhr.method == "POST" && xhr.url === mCAP.authentication.url() + 'login' && postData.password) {
        expect(postData.password).toBe('pass');
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(loginResponseDataSucc));
      } else {
        xhr.respond(401, { "Content-Type": "application/json" } );
      }
    }
  });

  afterEach(function () {
    server.restore();
    // reset the baseurl
    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.set(JSON.parse(mCAPAuthenticationAttributes));
  });


  it("Login config with set authentication successful", function () {

    mCAP.authentication.set('userName', 'm.mustermann');
    mCAP.authentication.set('orgaName', 'org');
    mCAP.authentication.set('password', 'pass');

    server.respondWith(serverSuccCallback);

    mCAP.authentication.login().then(function (data) {
      expect(mCAP.authentication.get('userName')).toBe('m.mustermann');
      expect(mCAP.authentication.get('orgaName')).toBe('org');
      expect(mCAP.authentication.get('password')).toBe('pass');
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);

  });

  it("Login config with login as options authentication successful", function () {

    server.respondWith(serverSuccCallback);

    mCAP.authentication.login({
      userName: 'm.mustermann',
      orgaName: 'org',
      password: 'pass'
    }).then(function (data) {
      expect(mCAP.authentication.get('userName')).toBe('m.mustermann');
      expect(mCAP.authentication.get('orgaName')).toBe('org');
      expect(mCAP.authentication.get('password')).toBe('pass');
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);
  });

  it("Login config with set userName and organisation successful", function () {

    mCAP.authentication.set('userName', 'm.mustermann');
    mCAP.authentication.set('orgaName', 'org');

    server.respondWith(serverSuccCallback);

    expect(mCAP.authentication.get('password')).toBe('');

    mCAP.authentication.login('pass').then(function (data) {
      expect(mCAP.authentication.get('userName')).toBe('m.mustermann');
      expect(mCAP.authentication.get('orgaName')).toBe('org');
      expect(mCAP.authentication.get('password')).toBe('');
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);

  });

  it("Login user is set", function () {

    mCAP.authentication.set('userName', 'm.mustermann');
    mCAP.authentication.set('orgaName', 'org');

    server.respondWith(serverSuccCallback);

    expect(mCAP.authentication.get('password')).toBe('');

    mCAP.authentication.login('pass').then(function (data) {
      expect(mCAP.User.prototype.isPrototypeOf(mCAP.authentication.get('user'))).toBeTruthy();
      expect(mCAP.authentication.get('userName')).toBe('m.mustermann');
      expect(mCAP.authentication.get('orgaName')).toBe('org');
      expect(mCAP.authentication.get('password')).toBe('');
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);

  });

  xit("Login organisation is set", function () {

    mCAP.authentication.set('userName', 'm.mustermann');
    mCAP.authentication.set('orgaName', 'org');

    server.respondWith(serverSuccCallback);

    expect(mCAP.authentication.get('password')).toBe('');

    mCAP.authentication.login('pass').then(function (data) {
      expect(mCAP.Organization.prototype.isPrototypeOf(mCAP.authentication.get('organization'))).toBeTruthy();
      expect(mCAP.authentication.get('userName')).toBe('m.mustermann');
      expect(mCAP.authentication.get('orgaName')).toBe('org');
      expect(mCAP.authentication.get('password')).toBe('');
      callback();
    });

    server.respond();

    sinon.assert.calledOnce(callback);

  });

  it("Login event succ", function () {

    mCAP.authentication.set('userName', 'm.mustermann');
    mCAP.authentication.set('orgaName', 'org');

    server.respondWith(serverSuccCallback);

    mCAP.authentication.login('pass');
    mCAP.authentication.on('login', function(obj, err, errMsg){
      expect(err).toBeDefined();
      expect(errMsg).toBeDefined();
      mCAP.authentication.off('login');
      callback(!obj.status);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);

  });

  it("Login event err", function () {

    mCAP.authentication.set('userName', 'm.mustermann');
    mCAP.authentication.set('orgaName', 'org');

    server.respondWith(serverSuccCallback);

    mCAP.authentication.login('');
    mCAP.authentication.on('authenticationerror', function(obj, err, errMsg){
      expect(err).toBe('error');
      expect(errMsg).toBe('Unauthorized');
      mCAP.authentication.off('login');
      callback(!obj.status);
    });

    server.respond();

    sinon.assert.calledWith(callback, false);
    sinon.assert.calledOnce(callback);

  });
});





















