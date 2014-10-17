describe("mCAP Organization Model and Organizations Collection", function () {

  it("Organization(s) Object", function () {


    expect(mCAP.currentOrganization).toBeDefined();
    expect(typeof mCAP.Organization).toBe('function');
    expect(typeof mCAP.Organizations).toBe('function');

    expect(Backbone.Model.prototype.isPrototypeOf(mCAP.Organization.prototype)).toBeTruthy();
    expect(Backbone.Collection.prototype.isPrototypeOf(mCAP.Organizations.prototype)).toBeTruthy();
    var testModel = new mCAP.Organization();
    expect(Backbone.Model.prototype.isPrototypeOf(testModel)).toBeTruthy();
    var testCollection = new mCAP.Organizations();
    expect(Backbone.Collection.prototype.isPrototypeOf(testCollection)).toBeTruthy();
    testModel = null;
    testCollection = null;

  });

});