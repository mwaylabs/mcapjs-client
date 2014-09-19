/*jshint unused:false */

var CollectionSelectable = function (collectionInstance, options) {
  var _collection = collectionInstance,
    _selected = options.selected || (options.radio?new Backbone.Model():new Backbone.Collection()),
    _radio = options.radio === true;

  this.getSelected = function(){
    if(_selected instanceof Backbone.Model){
      return this.getSelectedModels().first();
    } else if(_selected instanceof Backbone.Collection){
      return this.getSelectedModels();
    }
  };

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

  this.selectModel = function(model,force){
    if(model.get('uuid')){
      var modelToSelect = _collection.findWhere({uuid: model.get('uuid')});
      if(!modelToSelect){
        modelToSelect = _collection.add(model);
      }
      if (modelToSelect && modelToSelect.selectable) {
        modelToSelect.selectable.select(force);
      }
    }
  };

  this.selectModels = function(models,force){
    this.select(new Backbone.Collection(models),force);
    console.warn('The method selectModels() is deprecated and will be removed soon. Please use the new method select');
  };

  this.select = function (selected,force) {
    if(selected instanceof Backbone.Collection){
      selected.models.forEach(function (model) {
        this.selectModel(model,force);
      },this);
    } else if(selected instanceof Backbone.Model){
      this.selectModel(selected,force);
    }
  };

  this.reset = function () {
    this.unSelectAllModels();
    this.select(_selected,true);
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
    this.select(_selected, true);
  };

  (function _main(self) {

    if(!(_selected instanceof Backbone.Collection || _selected instanceof Backbone.Model)){
      console.error('Selected attribute has to be a collection! For now it will be converted into an collection but this function will be removed soon');
      _selected = new mCAP.Collection(_selected);
    }

    if(_selected instanceof Backbone.Model){
      _radio = true;
    } else if(_selected instanceof Backbone.Collection){
      _radio = false;
    }

    //self.select(_selected, true);

    _selected.on('add', function(){
      self.select(_selected, true);
    });

    collectionInstance.on('add change', function () {
      self.select(_selected, true);
    });

    if (!_collection instanceof Backbone.Collection) {
      throw new Error('First parameter has to be the instance of a collection');
    }
  }(this));

};