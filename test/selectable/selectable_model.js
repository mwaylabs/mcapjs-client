describe('Model Selectable', function () {

  it('should be initialized as unselected', function () {
    var model = new mCAP.Model();
    expect(model.selectable.isSelected()).toBe(false);
  });

  it('should be initialized as selected when selected option was set', function() {
    var SelectedModel = mCAP.Model.extend({
      selectableOptions: {selected: true}
    });
    var model = new SelectedModel();
    expect(model.selectable.isSelected()).toBe(true);
  });

  it('should be selectable and unselectable', function(){
    var model = new mCAP.Model();
    model.selectable.select();
    expect(model.selectable.isSelected()).toBe(true);
    model.selectable.unSelect();
    expect(model.selectable.isSelected()).toBe(false);
  });

  it('should be able to toggle its selected state', function(){
    var model = new mCAP.Model();
    model.selectable.toggleSelect();
    expect(model.selectable.isSelected()).toBe(true);
    model.selectable.toggleSelect();
    expect(model.selectable.isSelected()).toBe(false);
  });

  it('should accept a isDisabled function', function(){
    var isDisabledFn = jasmine.createSpy('isDisabledFn');
    var DisabledModel = mCAP.Model.extend({
      selectableOptions: {
        isDisabled: isDisabledFn
      }
    });
    var model = new DisabledModel();

    isDisabledFn.and.returnValue(false);
    model.selectable.select();
    expect(isDisabledFn).toHaveBeenCalled();
    expect(model.selectable.isSelected()).toBe(true);

    model.selectable.unSelect();
    isDisabledFn.and.returnValue(true);
    model.selectable.select();
    expect(isDisabledFn).toHaveBeenCalledWith();
    expect(model.selectable.isSelected()).toBe(false);
  });

  it('should throw an error if provided model is not a Backbone model instance', function(){
    var createModel = function(){
      new ModelSelectable({}, {});
    };
    expect(createModel).toThrow();
  });

  it('should fire the correct change events', function(){
    var changeHandler = jasmine.createSpy('changeHandler');
    var changeSelectHandler = jasmine.createSpy('changeSelectHandler');
    var changeUnselectHandler = jasmine.createSpy('changeUnselectHandler');

    var model = new mCAP.Model();
    model.selectable.on('change', changeHandler);
    model.selectable.on('change:select', changeSelectHandler);
    model.selectable.on('change:unselect', changeUnselectHandler);

    model.selectable.select();
    expect(changeHandler.calls.count()).toBe(1);
    expect(changeSelectHandler.calls.count()).toBe(1);

    model.selectable.unSelect();
    expect(changeHandler.calls.count()).toBe(2);
    expect(changeUnselectHandler.calls.count()).toBe(1);
  });

});