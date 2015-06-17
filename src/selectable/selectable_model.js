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

  this.select = function (options) {
    options = options || {};
    if ( (!this.isDisabled() || options.force) && !this.isSelected()) {
      _selected = true;
      if(!options.silent){
        this.trigger('change change:select',modelInstance,this);
      }
    }
  };

  this.unSelect = function (options) {
    options = options || {};
    if(this.isSelected()){
      _selected = false;
      if(!options.silent){
        this.trigger('change change:unselect',modelInstance,this);
      }
    }
  };

  this.toggleSelect = function () {
    if (this.isSelected()) {
      this.unSelect();
    } else {
      this.select();
    }
  };

  (function _main () {
    if (!(_model instanceof Backbone.Model)) {
      throw new Error('First parameter has to be the instance of a collection');
    }
  }());
};