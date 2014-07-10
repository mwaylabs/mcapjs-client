describe("mCAP.push", function () {

  var mCAPApplicationAttributes,
    server,
    callback,
    baseUrl,
    postDataSucc,
    pushId,
    getDataSucc,
    serverSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);

  pushId = '5854AE59-8642-4B05-BC71-72B76B4E81E8';
  baseUrl = 'http://www.mcap.com';

  beforeEach(function () {

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.application.set('baseUrl', baseUrl);
    mCAP.push.set('uuid', pushId);

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    getDataSucc = [
      "myTag",
      "myTag2"
    ];

    serverSuccCallback = function (xhr) {

      expect(xhr.url).toBe(baseUrl + '/push/api/v1/apps/' + pushId + '/tags');

      if (xhr.method == "GET") {
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(getDataSucc));
      } else {
        xhr.respond(500, { "Content-Type": "application/json" });
      }
    };

  });

  afterEach(function () {
    server.restore();
    // reset the baseurl
    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
  });


  it("get devices", function () {

    server.respondWith(serverSuccCallback);

    mCAP.push.tags.fetch().then(function (data) {
      expect(mCAP.push.tags.tags.length).toBe(2);
      expect(mCAP.push.tags.tags[0]).toBe(getDataSucc[0]);
      expect(mCAP.push.tags.tags[1]).toBe(getDataSucc[1]);
      callback(data);
    });

    server.respond();

    sinon.assert.calledWith(callback, getDataSucc);
    sinon.assert.calledOnce(callback);

  });



});





















