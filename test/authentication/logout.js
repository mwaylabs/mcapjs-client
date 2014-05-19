describe("mCAP.authentication", function () {

  var baseUrl, mCAPApplicationAttributes, mCAPAuthenticationAttributes, server, callback, responseDataSucc, serverSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
  mCAPAuthenticationAttributes = JSON.stringify(mCAP.authentication.attributes);

  beforeEach(function () {
    mCAP.application.set('baseUrl', 'http://www.mcap.com');

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    responseDataSucc = 'Successfully logged out.';

    serverSuccCallback = function (xhr) {
//      console.log(JSON.stringify(xhr, null, 10));
      var postData = JSON.parse(xhr.requestBody);
      if (xhr.method == "POST" && xhr.url === mCAP.authentication.url() + 'logout') {
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(responseDataSucc));
      }
    }
  });

  afterEach(function () {
    server.restore();

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);
  });


  it("Logout", function () {

    server.respondWith(serverSuccCallback);

    mCAP.authentication.logout().then(function (data) {
      callback(data);
    }).always(function(data){
      //console.log(data);
    });

    server.respond();

    sinon.assert.calledWith(callback, responseDataSucc);
    sinon.assert.calledOnce(callback);

  });

});





















