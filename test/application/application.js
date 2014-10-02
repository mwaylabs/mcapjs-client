describe("Application", function () {
  it("Object definition: mCAP.application", function () {

    expect(Application).toBeDefined();
    expect(Application.prototype.defaults).toBeDefined();
    expect(Application.prototype.defaults.baseUrl).toBeDefined();
    expect(Application.prototype.defaults.pushServiceApiVersion).toBeDefined();

    expect(mCAP.application).toBeDefined();
    expect(mCAP.Model.prototype.isPrototypeOf(mCAP.application)).toBeTruthy();
    expect(Backbone.Model.prototype.isPrototypeOf(mCAP.application)).toBeTruthy();

    expect(mCAP.application.get('baseUrl')).toEqual('');
    expect(mCAP.application.get('pushServiceApiVersion')).toEqual('v1');

  });
});