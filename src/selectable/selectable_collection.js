/*jshint unused:false */

var CollectionSelectable = function (collectionInstance, options) {

  var _collection = collectionInstance,
    _selected = options.selected || new Backbone.Collection(),
    _radio = options.radio === true;

  this.getSelectedModels = function () {
    var selected = new mCAP.Collection();
    _collection.models.forEach(function (model) {
      if (model.selectable && model.selectable.isSelected()) {
        selected.add(model);
      }
    });
    return selected;
  };

  this.getDisabledModels = function () {
    var disabled = new mCAP.Collection();
    _collection.models.forEach(function (model) {
      if (model.selectable && model.selectable.isDisabled()) {
        disabled.add(model);
      }
    });
    return disabled;
  };

  this.allModelsSelected = function () {
    var disabledModelsAmount = this.getDisabledModels().length;
    return this.getSelectedModels().length === _collection.length - disabledModelsAmount;
  };

  this.allModelsDisabled = function () {
    var allDisabled = true;
    _collection.models.forEach(function (model) {
      if (model.selectable && allDisabled) {
        allDisabled = model.selectable.isDisabled();
      }
    });
    return allDisabled;
  };

  this.toggleSelectAllModels = function () {
    if (this.allModelsSelected()) {
      this.unSelectAllModels();
    } else {
      this.selectAllModels();
    }
  };

  this.selectAllModels = function () {
    _collection.models.forEach(function (model) {
      if (model.selectable) {
        model.selectable.select();
      }
    });
  };

  this.selectModels = function (models,force) {
    models.forEach(function (model) {
      var modelToSelect = _collection.findWhere({uuid: model.id});
      if(!modelToSelect){
        modelToSelect = _collection.add(model);
      }
      if (modelToSelect.selectable) {
        modelToSelect.selectable.select(force);
      }

    });
  };

  this.reset = function () {
    this.unSelectAllModels();
    this.selectModels(_selected.models,true);
  };

  this.unSelectAllModels = function () {
    this.getSelectedModels().forEach(function (model) {
      if (model.selectable) {
        model.selectable.unSelect();
      }
    });
  };

  this.isRadio = function () {
    return _radio;
  };

  this.setPreselectedModels = function(models){
    _selected.add(models);
    this.selectModels(_selected.models, true);
  };

  (function _main(self) {

    if(!(_selected instanceof Backbone.Collection)){
      console.error('Selected attribute has to be a collection! For now it will be converted into an collection but this function will be removed soon');
      _selected = new mCAP.Collection(_selected);
    }

    _selected.on('add', function(){
      self.selectModels(_selected.models, true);
    });

    collectionInstance.on('add', function () {
      self.selectModels(_selected.models, true);
    });

    if (!_collection instanceof Backbone.Collection) {
      throw new Error('First parameter has to be the instance of a collection');
    }
  }(this));

};