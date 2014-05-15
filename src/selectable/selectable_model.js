/*jshint unused:false */
var ModelSelectable = function (modelInstance, options) {

  var _model = modelInstance,
    _selected = options.selected || false;

  this.isDisabled = options.isDisabled || function () {
    return false;
  };

  this.isSelected = function () {
    return _selected;
  };

  this.select = function () {
    if (!this.isDisabled()) {
      _selected = true;
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

  (function _main() {
    if (!_model instanceof Backbone.Model) {
      throw new Error('First parameter has to be the instance of a collection');
    }
  }());
};