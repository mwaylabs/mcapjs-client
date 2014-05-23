/*jshint unused:false */
var ModelSelectable = function (modelInstance, options) {

  var _model = modelInstance,
      _selected = options.selected || false;

  this.isDisabled = function () {
    if (options.isDisabled) {
      return options.isDisabled.apply(modelInstance, arguments);
    }
    return false;
  };

  this.isSelected = function () {
    return _selected;
  };

  this.select = function () {
    if (!this.isDisabled()) {
      if (_model.collection && _model.collection.selectable.isRadio()) {
        _model.collection.selectable.unSelectAllModels();
      }
      _selected = true;
    } else {
      _selected = false;
    }
  };

  this.unSelect = function () {
    _selected = false;
  };

  this.toggleSelect = function () {
    if (this.isSelected()) {
      this.unSelect();
    } else {
      this.select();
    }
  };

  (function _main () {
    if (!_model instanceof Backbone.Model) {
      throw new Error('First parameter has to be the instance of a collection');
    }
  }());
};