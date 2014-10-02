describe("mCAP.authentication", function () {

  var mCAPApplicationAttributes, mCAPAuthenticationAttributes, server, callback, serverSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
  mCAPAuthenticationAttributes = JSON.stringify(mCAP.authentication.attributes);

  beforeEach(function () {
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    serverSuccCallback = function (xhr) {
      xhr.respond(401, { "Content-Type": "application/json" } );
    }
  });

  afterEach(function () {
    server.restore();
    // reset the baseurl
    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);
  });

  it("register unauthorized", function () {


    mCAP.authentication.on('unauthorized', function(xhr, state, resp){
      expect(xhr).toBeDefined();
      expect(state).toBeDefined();
      expect(resp).toBeDefined();
      mCAP.authentication.off('unauthorized');
      callback(resp);
    });

    server.respondWith(serverSuccCallback);

    mCAP.authentication.login();

    server.respond();

    sinon.assert.calledWith(callback, 'Unauthorized');
    sinon.assert.calledOnce(callback);

  });

  it("unauthorized fetching data (collection)", function () {

    mCAP.authentication.on('unauthorized', function(xhr, state, resp){
      expect(xhr).toBeDefined();
      expect(state).toBeDefined();
      expect(resp).toBeDefined();
      mCAP.authentication.off('unauthorized');
      callback(resp);
    });

    server.respondWith(serverSuccCallback);

    var pushApps = new mCAP.PushApps();
    pushApps.fetch();

    server.respond();

    sinon.assert.calledWith(callback, 'Unauthorized');
    sinon.assert.calledOnce(callback);

  });

  it("unauthorized fetching data (model)", function () {

    mCAP.authentication.on('unauthorized', function(xhr, state, resp){
      expect(xhr).toBeDefined();
      expect(state).toBeDefined();
      expect(resp).toBeDefined();
      mCAP.authentication.off('unauthorized');
      callback(resp);
    });

    server.respondWith(serverSuccCallback);

    var pushApps = new mCAP.PushApp();
    pushApps.fetch();

    server.respond();

    sinon.assert.calledWith(callback, 'Unauthorized');
    sinon.assert.calledOnce(callback);

  });
});





















