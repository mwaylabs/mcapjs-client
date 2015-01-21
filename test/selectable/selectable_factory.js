describe('SelectableFactory', function () {

  it('has to throw an error is instance is not a mdoel or collection', function(){
    var testFn = function(){
      new SelectableFactory({}, {});
    };
    expect(testFn).toThrow();
  });

});