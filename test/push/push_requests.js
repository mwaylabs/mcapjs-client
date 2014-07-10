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
    mCAP.application.set('pushService', pushId);

    server = sinon.fakeServer.create();
    callback = sinon.spy();

    getDataSucc = {
      "items": [
        {
          "uuid": "E9A2A4BD-B23A-4E87-A399-A9DA1E925BF4",
          "providerType": "MCAP",
          "user": "m.mustermann",
          "vendor": "LG",
          "name": "Nexus 4",
          "osVersion": "4.0.2",
          "language": "de",
          "country": "DE",
          "attributes": {},
          "tags": [
            "myTag",
            "myTag2"
          ],
          "badge": 0,
          "createdAt": 1404979377000,
          "modifiedAt": 1404979377000
        },
        {
          "uuid": "F2AF7A4C-936E-4DDF-8C72-C2E684B17D4B",
          "providerType": "MCAP",
          "user": "m.mustermann",
          "vendor": "Samsung",
          "name": "S3",
          "osVersion": "4.0.2",
          "language": "de",
          "country": "DE",
          "attributes": {},
          "tags": [
            "myTag",
            "myTag2"
          ],
          "badge": 0,
          "createdAt": 1404987739000,
          "modifiedAt": 1404987739000
        }
      ]
    };

    postDataSucc = {
      "uuid": "3039B0A9-A034-4A21-A5EF-997F64503529",
      "createdAt": 1404995392000,
      "modifiedAt": 1404995392000
    };

    serverSuccCallback = function (xhr) {
//      console.log(JSON.stringify(xhr, null, 10));


      expect(xhr.url).toBe(baseUrl + '/push/api/v1/apps/' + pushId + '/devices');

      if (xhr.method == "GET") {
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(getDataSucc));
      } else if (xhr.method === 'POST') {
        var postData = JSON.parse(xhr.requestBody);
        postDataSucc = {
          "uuid": "3039B0A9-A034-4A21-A5EF-997F64503529",
          "providerType": postData.providerType,
          "user": postData.user,
          "vendor": postData.vendor,
          "name": postData.name,
          "osVersion": postData.osVersion,
          "language": postData.language,
          "country": postData.country,
          "tags": postData.tags,
          "badge": postData.badge,
          "createdAt": 1404995392000,
          "modifiedAt": 1404995392000
        };
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(postDataSucc));
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

    mCAP.push.devices.fetch().then(function (data) {
      expect(mCAP.push.devices.models.length).toBe(2);
      expect(mCAP.push.devices.get('F2AF7A4C-936E-4DDF-8C72-C2E684B17D4B')).toBeDefined();
      expect(mCAP.push.devices.get('E9A2A4BD-B23A-4E87-A399-A9DA1E925BF4')).toBeDefined();
      callback(data);
    });

    server.respond();

    sinon.assert.calledWith(callback, getDataSucc);
    sinon.assert.calledOnce(callback);

  });

  it("post devices", function () {

    server.respondWith(serverSuccCallback);

    var model = mCAP.push.devices.add({
      // should be default: "providerType" : "MCAP",
      "user": "m.mustermann",
      "vendor": "Samsung",
      "name": "S3",
      "osVersion": "4.0.2",
      // should be default: "language" : "de",
      // should be default:  "country" : "DE",
      "tags": [
        "myTag",
        "myTag2"
      ],
      "badge": 0
    });

    model.save().then(function (data) {
      expect(mCAP.push.devices.models.length).toBe(3);
      expect(model).toBeDefined();
      expect(model.get('uuid')).toEqual('3039B0A9-A034-4A21-A5EF-997F64503529');
      expect(model.get('providerType')).toEqual('MCAP');
      expect(model.get('user')).toEqual('m.mustermann');
      expect(model.get('vendor')).toEqual('Samsung');
      expect(model.get('osVersion')).toEqual('4.0.2');
      expect(model.get('language')).toEqual('de');
      expect(model.get('country')).toEqual('DE');
      expect(model.get('tags')).toEqual([
        "myTag",
        "myTag2"
      ]);
      expect(model.get('badge')).toEqual(0);
      expect(model.get('createdAt')).toEqual(1404995392000);
      expect(model.get('modifiedAt')).toEqual(1404995392000);

      callback();
    });

    server.respond();

    sinon.assert.calledOnce(callback);

  });


});





















