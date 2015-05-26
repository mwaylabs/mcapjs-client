describe("mCAP.authentication logout", function () {

  var baseUrl, mCAPApplicationAttributes, mCAPAuthenticationAttributes, server, callback, responseDataSucc, serverSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
  mCAPAuthenticationAttributes = JSON.stringify(mCAP.authentication.attributes);

  beforeEach(function () {
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
      mCAP.authentication.set(JSON.parse(mCAPAuthenticationAttributes));

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    responseDataSucc = {"message":"Successfully logged out"};

    serverSuccCallback = function (xhr) {
      var postData = JSON.parse(xhr.requestBody);
      if (xhr.method == "POST" && xhr.url === mCAP.authentication.url() + 'logout') {
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(responseDataSucc));
      }
    };
  });

  afterEach(function () {
    server.restore();

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
      mCAP.authentication.set(JSON.parse(mCAPAuthenticationAttributes));
  });


  it("should logout the user", function () {

    server.respondWith(serverSuccCallback);

    mCAP.authentication.logout().then(function (data) {
      delete data.attributes;
      callback(data);
    }).always(function(data){
      expect(mCAP.authentication.get('user').get('name')).toBe('');
      expect(mCAP.authentication.get('user').get('uuid')).toBeNull();
      expect(mCAP.authentication.get('user').get('organization').get('uuid')).toBeNull();
      expect(mCAP.authentication.get('authenticated')).toBeFalsy();
    });

    server.respond();

    sinon.assert.calledWith(callback, responseDataSucc);
    sinon.assert.calledOnce(callback);

  });

  it("Logout event", function () {

    server.respondWith(serverSuccCallback);

    mCAP.authentication.logout();

    mCAP.authentication.on('logout', function(obj){
      expect(obj).toBeDefined();
      expect(obj.message).toBeDefined();
      mCAP.authentication.off('logout');
      callback(true);
    });

    server.respond();

    sinon.assert.calledWith(callback, true);
    sinon.assert.calledOnce(callback);

  });

});





















