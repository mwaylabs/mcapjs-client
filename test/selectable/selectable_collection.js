fdescribe('Collection Selectable', function () {

  var collection;
  var TestModel;
  var DisabledModel;
  var __selectedCount = function(){
    return collection.selectable.getSelected().length;
  };

  beforeEach(function(){
    //this should work but fails because the models have no id attribute
    /*collection = new mCAP.Collection();
    collection.add([new mCAP.Model(), new mCAP.Model(), new mCAP.Model()]);*/

    collection = new mCAP.Collection();
    TestModel = mCAP.Model;
    DisabledModel = mCAP.Model.extend({
      selectableOptions: function(){
       return {
         isDisabled: function(){
           return true;
         }
       }
      }
    });
    collection.add([new TestModel({uuid: 1}), new TestModel({uuid: 2}), new TestModel({uuid: 3})]);
  });

  /* Basics */
  it('should return all selected models', function () {
    var model = collection.at(0);
    model.selectable.select();
    expect(__selectedCount()).toBe(1);
  });

  it('should select models', function(){
    expect(__selectedCount()).toBe(0);
    collection.selectable.select(collection.at(0));
    expect(__selectedCount()).toBe(1);
  });

  //fails because we check if a model has an idAttribute
  it('should select models without an idAttribute', function(){
    collection.reset();
    collection.add([new mCAP.Model(), new mCAP.Model(), new mCAP.Model()]);
    expect(__selectedCount()).toBe(0);
    collection.selectable.select(collection.at(0));
    expect(__selectedCount()).toBe(1);
  });

  //fails because we have no unselect method yet
  it('should unselect models', function(){
    collection.selectable.select(collection.at(0));
    expect(__selectedCount()).toBe(1);
    collection.selectable.unSelect(collection.at(0));
    expect(__selectedCount()).toBe(0);
  });

  it('should recognise when a model instance is selected directly', function(){
    var model = collection.at(0);
    model.selectable.select();
    expect(__selectedCount()).toBe(1);
  });

  it('should recognise when a model instance is unselected directly', function(){
    collection.selectable.select(collection.at(0));
    expect(__selectedCount()).toBe(1);
    var model = collection.at(0);
    model.selectable.unSelect();
    expect(__selectedCount()).toBe(0);
  });

  it('should return model as selected even when it is was removed from the collection', function(){
    collection.selectable.select(collection.at(0));
    collection.remove(collection.at(0));
    expect(__selectedCount()).toBe(1);
  });

  it('should return model as selected even when it collection was reset', function(){
    collection.selectable.select(collection.at(0));
    collection.selectable.select(collection.at(2));
    collection.reset();
    expect(__selectedCount()).toBe(2);
  });

  it('should not return model as selected when it was removed from the collection and the option unselectOnRemove is set to true', function(){
    var unSelectCollection = new (mCAP.Collection.extend({
      selectableOptions: function(){
        return {
          unSelectOnRemove: true
        }
      }
    }) )();
    unSelectCollection.add(new TestModel({uuid:1}));
    unSelectCollection.add(new TestModel({uuid:2}));
    unSelectCollection.add(new TestModel({uuid:3}));
    unSelectCollection.selectable.select(collection.at(0));
    expect(unSelectCollection.selectable.getSelected().length).toBe(1);
    unSelectCollection.remove(collection.at(0));
    expect(unSelectCollection.selectable.getSelected().length).toBe(0);
  });

  it('should not return model as selected when it was removed from the collection and the option unselectOnRemove is set to true', function(){
    var unSelectCollection = new (mCAP.Collection.extend({
      selectableOptions: function(){
        return {
          unSelectOnRemove: true
        }
      }
    }) )();
    unSelectCollection.add(new TestModel({uuid:1}));
    unSelectCollection.add(new TestModel({uuid:2}));
    unSelectCollection.add(new TestModel({uuid:3}));
    unSelectCollection.selectable.select(collection.at(0));
    unSelectCollection.selectable.select(collection.at(1));
    unSelectCollection.selectable.select(collection.at(2));
    expect(unSelectCollection.selectable.getSelected().length).toBe(3);
    unSelectCollection.reset();
    expect(unSelectCollection.selectable.getSelected().length).toBe(0);
  });

  it('should select all models', function(){
    collection.selectable.selectAll();
    expect(__selectedCount()).toBe(collection.length);
  });

  it('should unselect all models', function(){
    collection.selectable.select(collection.at(0));
    collection.selectable.select(collection.at(1));
    expect(__selectedCount()).toBe(2);
    collection.selectable.unSelectAll();
    expect(__selectedCount()).toBe(0);
  });

  it('should provide if all models are selected when calling selectAll', function(){
    expect(collection.selectable.allSelected()).toBeFalsy(false);
    collection.selectable.selectAll();
    expect(collection.selectable.allSelected()).toBeTruthy(true);
  });

  it('should provide if all models are selected when the models are selected', function(){
    expect(collection.selectable.allSelected()).toBeFalsy();
    collection.selectable.select(collection.at(0));
    expect(collection.selectable.allSelected()).toBeFalsy();
    collection.selectable.select(collection.at(1));
    collection.selectable.select(collection.at(2));
    expect(collection.selectable.allSelected()).toBeTruthy();
    collection.selectable.unSelect(collection.at(2));
    expect(collection.selectable.allSelected()).toBeFalsy();
  });

  it('should return models where the selectable is disabled', function(){
    var disabledModel = new DisabledModel();
    expect(collection.selectable.getDisabled().length).toBe(0);
    collection.add(disabledModel);
    expect(collection.selectable.getDisabled().length).toBe(1);
    collection.remove(disabledModel);
    expect(collection.selectable.getDisabled().length).toBe(0);
  });


  it('should ignore disabled models when providing if all models are selected', function(){
    var disabledModel = new DisabledModel(),
        modelIsDisabled = true;

    disabledModel.selectable.isDisabled = function(){
      return modelIsDisabled;
    };

    collection.add(disabledModel);
    collection.selectable.select(collection.at(0));
    collection.selectable.select(collection.at(1));
    collection.selectable.select(collection.at(2));
    expect(collection.selectable.allSelected()).toBeTruthy();
    modelIsDisabled = false;
    expect(collection.selectable.allSelected()).toBeFalsy();
    collection.remove(disabledModel);
    expect(collection.selectable.allSelected()).toBeTruthy();
    collection.add(disabledModel);
  });

  it('should provide if all models are disabled', function(){
    expect(collection.selectable.allDisabled()).toBeFalsy();
    collection.reset();
    expect(collection.selectable.getSelected().length).toBe(0);
    collection.add(new DisabledModel());
    expect(collection.selectable.allDisabled()).toBeTruthy();
  });


  /* Toggle all */
  it('should toggle all models selected', function(){
    expect(__selectedCount()).toBe(0);
    collection.selectable.toggleSelectAll();
    expect(__selectedCount()).toBe(collection.length);
  });

  it('should toggle all models selected when not every model is already selected', function(){
    collection.selectable.select(collection.at(0));
    expect(__selectedCount()).toBe(1);
    collection.selectable.toggleSelectAll();
    expect(__selectedCount()).toBe(collection.length);
  });

  it('should toggle all models unselected when all models are already selected', function(){
    collection.selectable.selectAll();
    collection.selectable.toggleSelectAll();
    expect(__selectedCount()).toBe(0);
  });


  /* Radio (Single Select) Mode */
  it('should not initialize with radio selection when no options passed', function(){
    //make a new selection with the already existing collection (ust for testing)
    var selectable = new CollectionSelectable(collection, {});
    expect(selectable.isSingleSelection()).toBe(false);
  });

  it('should initialize with radio selection when passed via options', function(){
    var selectable = new CollectionSelectable(collection, {isSingleSelection: true});
    expect(selectable.isSingleSelection()).toBe(true);
  });

  it('should not initialize with radio selection when the "selected" option is a collection', function(){
    var selectable = new CollectionSelectable(collection, {preSelected: new mCAP.Collection()});
    expect(selectable.isSingleSelection()).toBe(false);
  });

  fit('should initialize with radio selection when the "selected" option is a model', function(){
    var selectable = new CollectionSelectable(collection, {preSelected: new mCAP.Model()});
    expect(selectable.isSingleSelection()).toBe(true);
  });

  //fails because getSelected does not return a model when in radio mode yet (it returns always a collection)
  xit('should return a model which is an instance of the the main collections model type when calling getSelected when radio mode is on', function(){
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {radio: true},
      model: TestModel
    });
    var mainCollection = new MainCollection();
    mainCollection.add(new TestModel({uuid: 123}));
    mainCollection.selectable.select(mainCollection.at(0));
    expect(mainCollection.selectable.getSelected() instanceof TestModel).toBe(true);
  });

  //fails because the returned collection is an instance of Backbone.Collection and not an instanceof the main collection
  xit('should return a collection which is an instance of the main collections type when calling getSelected when radio mode is off', function(){
    var MainCollection = mCAP.Collection.extend({});
    var mainCollection = new MainCollection();
    mainCollection.add(new TestModel({uuid: 321}));
    mainCollection.selectable.select(mainCollection.at(0));
    expect(mainCollection.selectable.getSelected() instanceof MainCollection).toBe(true);
  });

  it('should always only have one selected model when in radio mode and model is selected through the collection', function(){
    var RadioCollection = mCAP.Collection.extend({
      selectableOptions: {radio: true}
    });
    var radioCollection = new RadioCollection();
    radioCollection.add(new TestModel({uuid: 1}));
    radioCollection.add(new TestModel({uuid: 2}));
    expect(radioCollection.selectable.getSelected().length).toBe(0);
    radioCollection.selectable.select(radioCollection.at(0));
    expect(radioCollection.selectable.getSelected().length).toBe(1);
    radioCollection.selectable.select(radioCollection.at(1));
    expect(radioCollection.selectable.getSelected().length).toBe(1);
  });

  it('should always only have one selected model when in radio mode and model is selected through the model', function(){
    var RadioCollection = mCAP.Collection.extend({
      selectableOptions: {radio: true}
    });
    var radioCollection = new RadioCollection();
    radioCollection.add(new TestModel({uuid: 1}));
    radioCollection.add(new TestModel({uuid: 2}));
    expect(radioCollection.selectable.getSelected().length).toBe(0);
    radioCollection.at(0).selectable.select();
    expect(radioCollection.selectable.getSelected().length).toBe(1);
    radioCollection.at(1).selectable.select();
    expect(radioCollection.selectable.getSelected().length).toBe(1);
  });


  /* Preselection */
  it('should select all models which are in the preselected collection', function(){
    var preselect = new mCAP.Collection([new TestModel({uuid: 1}), new TestModel({uuid: 2})]);
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {selected: preselect}
    });
    //var mainCollection = new MainCollection([new TestModel({uuid: 1}), new TestModel({uuid: 2}), new TestModel({uuid: 3})]);
    var mainCollection = new MainCollection();
    mainCollection.add(new TestModel({uuid: 1}));
    mainCollection.add(new TestModel({uuid: 2}));
    mainCollection.add(new TestModel({uuid: 3}));
    expect(mainCollection.selectable.getSelected().length).toBe(2);
  });

  //fails because the 'add' event is not triggered when main collectio is directly initiaized with models
  xit('should select all models which are in the preselected collection when the main collection is initialized with models insteaf of add/fetch', function(){
    var preselect = new mCAP.Collection([new TestModel({uuid: 1}), new TestModel({uuid: 2})]);
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {selected: preselect}
    });
    var mainCollection = new MainCollection([new TestModel({uuid: 1}), new TestModel({uuid: 2}), new TestModel({uuid: 3})]);
    expect(mainCollection.selectable.getSelected().length).toBe(2);
  });

  it('should add models (which are in the preselected collection but do not exist in the main collection) to the main collection and select them', function(){
    var preselect = new mCAP.Collection([new TestModel({uuid: 1}), new TestModel({uuid: 2})]);
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {selected: preselect}
    });
    var mainCollection = new MainCollection();
    mainCollection.add(new TestModel({uuid: 1}));
    expect(mainCollection.selectable.getSelected().length).toBe(2);
  });

  //fails because the 'add' event is not triggered when main collectio is directly initiaized with models
  xit('should add models (which are in the preselected collection but do not exist in the main collection) to the main collection and select them when main collection is initialized with mdoels instead of add/fetch', function(){
    var preselect = new mCAP.Collection([new TestModel({uuid: 1}), new TestModel({uuid: 2})]);
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {selected: preselect}
    });
    var mainCollection = new MainCollection([new TestModel({uuid: 1})]);
    expect(mainCollection.selectable.getSelected().length).toBe(2);
  });

  //fails because this check is not implemented yet
  xit('should throw an error if models from the preselected collection are not an instance of the main collections model type', function(){
    var preselect = new mCAP.Collection([new mCAP.Model({uuid: 1}), new TestModel({uuid: 2})]);
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {selected: preselect},
      model: TestModel
    });
    var mainCollection = new MainCollection();

    var testFn = function(){
      mainCollection.add(new TestModel({uuid: 1}));
    };
    expect(testFn).toThrow();
  });

  it('should not remove models which have been added by the preselected collection from the main collection when they are unselected', function(){
    var preselect = new mCAP.Collection([new TestModel({uuid: 1}), new TestModel({uuid: 2})]);
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {selected: preselect}
    });
    var mainCollection = new MainCollection();
    mainCollection.add(new TestModel({uuid: 1}));
    expect(mainCollection.length).toBe(2);
    expect(mainCollection.selectable.getSelected().length).toBe(2);
    mainCollection.get(2).selectable.unSelect();
    expect(mainCollection.length).toBe(2);
    expect(mainCollection.selectable.getSelected().length).toBe(1);
  });

  it('should select models which are added later to the preselecteed collection', function(){
    var preselect = new mCAP.Collection();
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {selected: preselect}
    });
    var mainCollection = new MainCollection();
    mainCollection.add(new TestModel({uuid: 1}));
    mainCollection.add(new TestModel({uuid: 2}));
    expect(mainCollection.selectable.getSelected().length).toBe(0);

    preselect.add(new TestModel({uuid: 1}));
    expect(mainCollection.selectable.getSelected().length).toBe(1);

    preselect.add(new TestModel({uuid: 2}));
    expect(mainCollection.selectable.getSelected().length).toBe(2);
  });

  it('should add and select models which are added later to the preselecteed collection and do not exist in the main collection', function(){
    var preselect = new mCAP.Collection();
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {selected: preselect}
    });
    var mainCollection = new MainCollection();
    expect(mainCollection.length).toBe(0);
    expect(mainCollection.selectable.getSelected().length).toBe(0);

    preselect.add(new TestModel({uuid: 1}));
    expect(mainCollection.length).toBe(1);
    expect(mainCollection.selectable.getSelected().length).toBe(1);

    preselect.add(new TestModel({uuid: 2}));
    expect(mainCollection.length).toBe(2);
    expect(mainCollection.selectable.getSelected().length).toBe(2);
  });

  it('should reset all models to the preselected collection', function(){
    var preselect = new mCAP.Collection([new TestModel({uuid: 1}), new TestModel({uuid: 2})]);
    var MainCollection = mCAP.Collection.extend({
      selectableOptions: {selected: preselect}
    });
    var mainCollection = new MainCollection();
    mainCollection.add([
      new TestModel({uuid: 1}),
      new TestModel({uuid: 2}),
      new TestModel({uuid: 3}),
      new TestModel({uuid: 4})
    ]);

    expect(mainCollection.selectable.getSelected().length).toBe(2);
    mainCollection.selectable.selectAllModels();
    expect(mainCollection.selectable.getSelected().length).toBe(4);

    mainCollection.selectable.reset();
    expect(mainCollection.selectable.getSelected().length).toBe(2);
  });

  /* Exepction Tests */
  it('should throw an error if the collection parameter is not a collection', function(){
    var testFn = function(){
      var selectable = new CollectionSelectable({}, {});
    };
    expect(testFn).toThrow();
  });

  it('should throw an error if the selected option is not a collection or model', function(){
    var testFn = function(){
      var selectable = new CollectionSelectable(collection, {selected: {}});
    };
    expect(testFn).toThrow();
  });

  /* Special Cases */
  it('should not select (ignore) when something is passed to be selected what is not a model or collection', function(){
    collection.selectable.select({uuid: 1});
    expect(__selectedCount()).toBe(0);
  });

  it('should not select (ignore) when a model is passed to be selected which has no selectable', function(){
    var ModelWithoutSelectable = mCAP.Model.extend({
      selectable: false
    });
    var modelWithoutSelectable = new ModelWithoutSelectable({uuid: 1});
    var CustomCollection = mCAP.Collection.extend({
      model: ModelWithoutSelectable
    });

    var customCollection = new CustomCollection();
    customCollection.add(modelWithoutSelectable);
    customCollection.selectable.select(customCollection.at(0));
    expect(customCollection.selectable.getSelected().length).toBe(0);
    customCollection.selectable.selectAllModels();
    expect(customCollection.selectable.getSelected().length).toBe(0);
  });

});