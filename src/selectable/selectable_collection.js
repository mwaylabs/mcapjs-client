/*jshint unused:false */

var CollectionSelectable = function (collectionInstance) {

  var _collection = collectionInstance;

  this.getSelectedModels = function () {
    var selected = [];
    _collection.models.forEach(function (model) {
      if (model.selectable && model.selectable.isSelected()) {
        selected.push(model);
      }
    });
    return selected;
  };

  this.getDisabledModels = function(){
    var disabled = [];
    _collection.models.forEach(function (model) {
      if (model.selectable && model.selectable.isDisabled()) {
        disabled.push(model);
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

  this.unSelectAllModels = function () {
    this.getSelectedModels().forEach(function (model) {
      if (model.selectable) {
        model.selectable.unSelect();
      }
    });
  };

  (function _main() {
    if (!_collection instanceof Backbone.Collection) {
      throw new Error('First parameter has to be the instance of a collection');
    }
  }());

};