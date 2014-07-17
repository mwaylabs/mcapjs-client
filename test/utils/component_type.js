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
    expect(mCAP.FILE).toEqual('d5b8e89f-b912-4c93-a419-866445dd3df3');
    expect(mCAP.FOLDER).toEqual('73a7cf45-10b1-4636-84c0-22b5a99692e1');
    expect(mCAP.STUDIO).toEqual('F4C7059E-B62B-4600-A7BC-B0CC43E75465');

  });

});





















