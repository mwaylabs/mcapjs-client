describe("mCAP.push", function () {

  var mCAPApplicationAttributes,
    server,
    callback,
    baseUrl,
    pushId,
    serverSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);

  baseUrl = 'http://www.mcap.com';

  beforeEach(function () {

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.application.set('baseUrl', baseUrl);
    mCAP.push.set('uuid', pushId);

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    serverSuccCallback = function (xhr) {

      if (xhr.method === "PUT" || xhr.method === "POST") {
        var postData = JSON.parse(xhr.requestBody);
        if (postData.shouldRaisError) {
          delete postData.shouldRaisError;
          xhr.respond(500, { "Content-Type": "application/json" }, JSON.stringify(postData));

        } else {
          xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(postData));
        }
      }
    };

  });

  afterEach(function () {
    server.restore();
    // reset the baseurl
    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
  });


  it("Create Object: Version 1", function () {

    server.respondWith(serverSuccCallback);

    var model = new mCAP.Component({});

    model.save().then(function () {
      expect(model.get('version')).toBe(1);
      callback();
    });

    server.respond();
    sinon.assert.calledOnce(callback);

  });

  it("Create Object with server error", function () {

    server.respondWith(serverSuccCallback);

    var model = new mCAP.Component({
      shouldRaisError: true
    });

    model.save().fail(function () {
      expect(model.get('version')).toBe(0);
      callback();
    });

    server.respond();
    sinon.assert.calledOnce(callback);

  });

  it("Update Object", function () {

    server.respondWith(serverSuccCallback);

    var model = new mCAP.Component({
      version: 3,
      uuid: 123456
    });

    model.save().then(function () {
      expect(model.get('version')).toBe(4);
      callback();
    });

    server.respond();
    sinon.assert.calledOnce(callback);

  });

  it("Update Object raises an error", function () {

    server.respondWith(serverSuccCallback);

    var model = new mCAP.Component({
      shouldRaisError: true,
      version: 3,
      uuid: 123456
    });

    model.save().fail(function () {
      expect(model.get('version')).toBe(3);
      callback();
    });

    server.respond();
    sinon.assert.calledOnce(callback);

  });

});





















