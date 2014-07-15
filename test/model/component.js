describe("mCAP Component", function () {

  it("Component definition", function () {


    expect(mCAP.Component).toBeDefined();
    expect(typeof mCAP.Component).toBe('function');

    expect(mCAP.Model.prototype.isPrototypeOf(mCAP.Component.prototype)).toBeTruthy();
    expect(Backbone.Model.prototype.isPrototypeOf(mCAP.Component.prototype)).toBeTruthy();
    expect(mCAP.Component.prototype.defaults.version).toBeDefined();
    expect(mCAP.Component.prototype.defaults.uuid).toBeDefined();

    var testModel = new mCAP.Component();
    expect(mCAP.Component.prototype.isPrototypeOf(testModel)).toBeTruthy();
    expect(Backbone.Model.prototype.isPrototypeOf(testModel)).toBeTruthy();
    expect(testModel.attributes.version).toBeDefined();
    expect(testModel.attributes.uuid).toBeDefined();

    testModel = null;

  });


  it("Properties ", function () {



  });


  it("Instance ", function () {

    var a = new mCAP.Component({});
    var b = new mCAP.Component({});
    expect(a.hasOwnProperty('version')).toBeFalsy();
    expect(b.hasOwnProperty('version')).toBeFalsy();
    expect(b.hasOwnProperty('uuid')).toBeFalsy();
    expect(b.hasOwnProperty('uuid')).toBeFalsy();

  });

});