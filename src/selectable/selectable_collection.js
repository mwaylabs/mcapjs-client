/*jshint unused:false */

var CollectionSelectable = function (collectionInstance, options) {
  var _collection = collectionInstance,
    _selected = options.selected || (options.radio ? new Backbone.Model() : new Backbone.Collection()),
    _radio = options.radio === true,
    _addWhenNotInList = true;

  this.getSelectedModels = function () {
    var selected = new mCAP.Collection();
    _collection.models.forEach(function (model) {
      if (model.selectable && model.selectable.isSelected()) {
        selected.add(model,{silent:true});
      }
    });
    return selected;
  };

  //this method will replace the getSelectedModels method and return a either a model or a collection depending on isRadio
  this.getSelected = function () {
    return this.getSelectedModels();
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

  var selectModel = function (model, force) {
    if (model.get(model.idAttribute)) {
      var modelToSelect = _collection.get(model);
      if (!modelToSelect && _addWhenNotInList) {
        //Adds model to the Collction when it is not already in the list
        modelToSelect = _collection.add(model, {silent: true});
      }
      if (modelToSelect && modelToSelect.selectable) {
        modelToSelect.selectable.select(force);
      }
    }
  };

  this.select = function (selected, force) {
    if (selected instanceof Backbone.Collection) {
      selected.models.forEach(function (model) {
        selectModel(model, force);
      }, this);
    } else if (selected instanceof Backbone.Model) {
      selectModel(selected, force);
    }
  };

  this.reset = function () {
    this.unSelectAllModels();
    this.select(_selected, true);
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

  this.setPreselectedModels = function (models) {
    _selected.add(models,{silent:true});
    this.select(_selected, true);
  };

  (function _main(self) {
    if (!(_selected instanceof Backbone.Collection || _selected instanceof Backbone.Model)) {
      console.error('Selected attribute has to be a collection! For now it will be converted into an collection but this function will be removed soon');
      _selected = new mCAP.Collection(_selected);
    }

    if (_selected instanceof Backbone.Model) {
      _radio = true;
    } else if (_selected instanceof Backbone.Collection) {
      _radio = false;
    }

    _selected.on('add', function () {
      self.select(_selected, true);
    }, this);

    _collection.on('add', function (model) {
      self.select(_selected, true);

      if (model && model.selectable) {
        model.selectable.on('change:select', function () {
          self.trigger('change change:add', model, self);
        }, this);

        model.selectable.on('change:unselect', function () {
          self.trigger('change change:remove', model, self);
        }, this);
      }
    }, this);

    if (!_collection instanceof Backbone.Collection) {
      throw new Error('First parameter has to be the instance of a collection');
    }
  }(this));

};

