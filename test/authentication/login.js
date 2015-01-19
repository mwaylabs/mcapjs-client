describe("mCAP.authentication login", function () {

  var mCAPApplicationAttributes, mCAPAuthenticationAttributes, server, callback, loginResponseDataSucc, serverSuccWithoutOrgaCallback, serverSuccWithOrgaCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
  mCAPAuthenticationAttributes = JSON.stringify(mCAP.authentication.attributes);

  beforeEach(function () {
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.set(JSON.parse(mCAPAuthenticationAttributes));

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    loginResponseDataSucc = {
      "user": {
        "aclEntries": ["8475877d-853a-4e62-8918-a54a99a6c298:rw"],
        "uuid": "bdebbaf3-5bef-4b04-a7e6-4a95814f6da3",
        "name": "m.mustermann",
        "givenName": "Max",
        "surname": "Mustermann",
        "organizationUuid": "0644e9bf-923d-4e4a-b232-edd9dcd27d23",
        "email": "m.nustermann@mcap.com",
        "lastLoggedTime": 1400168482517,
        "locked": false,
        "activated": true,
        "readonly": false,
        "version": 3818,
        "effectivePermissions": "*",
        "preferences": {"pageSize": "500"}
      },
      "organization": {
        "uuid": "0644e9bf-923d-4e4a-b232-edd9dcd27d23",
        "aclEntries": ["8475877d-853a-4e62-8918-a54a99a6c298:rw"],
        "name": "M-Way Solutions",
        "uniqueName": "org",
        "address": {"country": "Germany"},
        "billingSettings": {
          "billingAddress": {"country": "Germany"},
          "billingPerson": {"phone": [], "mobilePhone": [], "email": []},
          "currency": "EUR"
        },
        "technicalPerson": {"phone": [], "mobilePhone": [], "email": []},
        "assetPath": "/organizations/mway",
        "reportLocaleString": "de_DE",
        "defaultRoles": ["8475877d-853a-4e62-8918-a54a99a6c298"],
        "version": 2,
        "effectivePermissions": "*"
      },
      "roles": [
        {"name": "DEVELOPERS", "systemPermission": false},
        {"name": "M-WAY SOLUTIONS", "systemPermission": false},
        {"name": "USERS", "systemPermission": false},
        {"name": "ADMIN", "systemPermission": false}
      ]
    };

    serverSuccWithoutOrgaCallback = function (xhr) {
      var postData = JSON.parse(xhr.requestBody);
      expect(xhr.url).toBe(mCAP.authentication.url() + 'login');
      expect(xhr.method).toBe('POST');

      if (postData.password === 'pass' && postData.userName === 'm.mustermann') {
        xhr.respond(200, {"Content-Type": "application/json"}, JSON.stringify(loginResponseDataSucc));
      } else {
        xhr.respond(401, {"Content-Type": "application/json"});
      }
    };

    serverSuccWithOrgaCallback = function(xhr){
      var postData = JSON.parse(xhr.requestBody);
      expect(postData.userName).toBe('org\\m.mustermann');
      expect(postData.password).toBe('pass');
      expect(xhr.url).toBe(mCAP.authentication.url() + 'login');
      expect(xhr.method).toBe('POST');

      xhr.respond(200, {"Content-Type": "application/json"}, JSON.stringify(loginResponseDataSucc));

    };
  });

  afterEach(function () {
    server.restore();
    // reset the baseurl
    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.set(JSON.parse(mCAPAuthenticationAttributes));
  });

  it("should be successful authenticated when organization is passed as parameter", function () {

    server.respondWith(serverSuccWithOrgaCallback);

    mCAP.Authentication.login('m.mustermann', 'pass', 'org').then(function (authentication) {
      expect(authentication instanceof mCAP.Authentication).toBeTruthy();
      expect(mCAP.authentication.get('user').get('name')).toBe('m.mustermann');
      expect(mCAP.authentication.get('user').get('organization').get('uniqueName')).toBe('org');
      expect(mCAP.authentication.get('authenticated')).toBeTruthy();
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);

  });

  it("should be successful authenticated when no organization is passed as parameter", function () {

    server.respondWith(serverSuccWithoutOrgaCallback);

    mCAP.Authentication.login('m.mustermann', 'pass').then(function () {
      expect(mCAP.authentication.get('user').get('name')).toBe('m.mustermann');
      expect(mCAP.authentication.get('user').get('organization').get('uniqueName')).toBe('org');
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);

  });

  it("should fail when credentials are wrong", function () {

    server.respondWith(serverSuccWithoutOrgaCallback);

    mCAP.Authentication.login('wrong', 'wrong').fail(function(){
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);

  });

});





















