describe("mCAP.push", function () {
  it("Object definition: Push", function () {

    expect(Push).toBeDefined();
    expect(Push.prototype.hasOwnProperty('devices')).toBeTruthy();
    expect(Push.prototype.hasOwnProperty('jobs')).toBeTruthy();
    expect(Push.prototype.hasOwnProperty('tags')).toBeTruthy();

    expect(mCAP.push.MCAP).toBeDefined();

    expect(mCAP.push).toBeDefined();
    expect(mCAP.Model.prototype.isPrototypeOf(mCAP.push)).toBeTruthy();
    expect(Backbone.Model.prototype.isPrototypeOf(mCAP.push)).toBeTruthy();


    var push = new Push({});

    expect(push.endpoint).toBeDefined();
    expect(mCAP.push.endpoint).toBeDefined();
    expect(push.endpoint).toEqual('/push/api/v1/apps/');
  });

});