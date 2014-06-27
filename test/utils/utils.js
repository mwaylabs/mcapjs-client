describe("mCAP.Utils", function () {

  it("Utils definition", function () {

    expect(mCAP.Utils).toBeDefined();
    expect(typeof mCAP.Utils.request).toEqual('function');
  });

  it("mCAP.Utils.request", function () {
    expect(mCAP.Utils.request({}).always).toBeDefined();
    expect(mCAP.Utils.request({}).then).toBeDefined();
    expect(mCAP.Utils.request({}).fail).toBeDefined();
    // quick hack - was to lazy to search for the correct implementation
    // set error to undefined
    var e = void 0;
    // raise the error
    try{
      mCAP.Utils.request();
    }catch(err){
      // catch the error - so the error is defined
      e = err;
    }
    // expect the catch!
    expect(e).toBeDefined();


  });

});





















