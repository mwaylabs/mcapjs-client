describe("mCap.authentication", function () {

  var baseUrl, mCapApplicationAttributes, mCapAuthenticationAttributes, server, callback, responseDataSucc, serverSuccCallback;

  mCapApplicationAttributes = JSON.stringify(mCap.application.attributes);
  mCapAuthenticationAttributes = JSON.stringify(mCap.authentication.attributes);

  beforeEach(function () {
    mCap.application.set('baseUrl', 'http://www.mcap.com');

    mCap.application.attributes = JSON.parse(mCapApplicationAttributes);
    mCap.authentication.attributes = JSON.parse(mCapAuthenticationAttributes);

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    responseDataSucc = 'Successfully logged out.';

    serverSuccCallback = function (xhr) {
//      console.log(JSON.stringify(xhr, null, 10));
      var postData = JSON.parse(xhr.requestBody);
      if (xhr.method == "POST" && xhr.url === mCap.authentication.url() + 'logout') {
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(responseDataSucc));
      }
    }
  });

  afterEach(function () {
    server.restore();

    mCap.application.attributes = JSON.parse(mCapApplicationAttributes);
    mCap.authentication.attributes = JSON.parse(mCapAuthenticationAttributes);
  });


  it("Logout", function () {

    server.respondWith(serverSuccCallback);

    mCap.authentication.logout().then(function (data) {
      callback(data);
    }).always(function(data){
      //console.log(data);
    });

    server.respond();

    sinon.assert.calledWith(callback, responseDataSucc);
    sinon.assert.calledOnce(callback);

  });

});





















