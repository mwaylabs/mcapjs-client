//describe("mCAP.push", function () {
//
//  var mCAPApplicationAttributes,
//    server,
//    callback,
//    responseDataSucc,
//    serverSuccCallback;
//
//  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
//
//  beforeEach(function () {
//    mCAP.application.set('baseUrl', 'http://www.mcap.com');
//
//    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
//
//    server = sinon.fakeServer.create();
//    callback = sinon.spy();
//
//    responseDataSucc = {
//      "uuid": "E9A2A4BD-B23A-4E87-A399-A9DA1E925BF4",
//      "providerType": "MCAP",
//      "user": "m.musterman",
//      "vendor": "Samsung",
//      "name": "S3",
//      "osVersion": "4.0.2",
//      "language": "de",
//      "country": "DE",
//      "attributes": {},
//      "tags": [
//        "myTag",
//        "myTag2"
//      ],
//      "badge": 0,
//      "createdAt": 1404979377000,
//      "modifiedAt": 1404979377000
//    };
//
//    serverSuccCallback = function (xhr) {
////      console.log(JSON.stringify(xhr, null, 10));
//
//      if (xhr.method == "POST") {
//        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(responseDataSucc));
//      } else {
//        xhr.respond(500, { "Content-Type": "application/json" });
//      }
//    }
//  });
//
//  afterEach(function () {
//    server.restore();
//    // reset the baseurl
//    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
//  });
//
//
//  it("register device", function () {
//
//    server.respondWith(serverSuccCallback);
//
//    mCAP.push.register().then(function (data) {
//      expect(mCAP.authentication.get('userName')).toBe('m.mustermann');
//      expect(mCAP.authentication.get('orgaName')).toBe('org');
//      expect(mCAP.authentication.get('password')).toBe('pass');
//      delete data.attributes;
//      callback(data);
//    });
//
//    server.respond();
//
//    sinon.assert.calledWith(callback, responseDataSucc);
//    sinon.assert.calledOnce(callback);
//
//  });
//
//
//});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
