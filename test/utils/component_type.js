describe("mCAP.Utils component type", function () {

  it("mCAP.Utils.getComponentType", function () {
    expect(mCAP.Utils.getComponentType).toBeDefined();
    expect(typeof mCAP.Utils.getComponentType).toEqual('function');


    var push = new mCAP.PushApp();
    expect(mCAP.Utils.getComponentType(push)).toEqual(mCAP.PUSH_SERVICE);
    push = null;

  });

  it("mCAP constants for component type", function () {

    expect(mCAP.ASSET).toEqual('ASSET');
    expect(mCAP.CHANNEL).toEqual('CHANNEL');
    expect(mCAP.PIPELINE).toEqual('PIPELINE');
    expect(mCAP.SERVICE_CONNECTION).toEqual('SERVICE_CONNECTION');
    expect(mCAP.META_MODEL).toEqual('META_MODEL');
    expect(mCAP.SCHEDULER_TASK).toEqual('SCHEDULER_TASK');
    expect(mCAP.PUSH_SERVICE).toEqual('PUSH_SERVICE');

  });

});





















