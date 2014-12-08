/*jshint unused:false */

var CollectionSelectable = function (collectionInstance, options) {
  var _collection = collectionInstance,
    _selected = options.selected || (options.radio ? new Backbone.Model() : new Backbone.Collection()),
    _radio = options.radio === true,
    _addWhenNotInList = false;

  /*
   We need this function for the counter
   selected is the actual collection whereas _selected is the collection with all selected items
   Some items just are not fetched yet because of pagination
  */
  this.getSelectedAmount = function(){
    var selected = new mCAP.Collection();
    _collection.models.forEach(function (model) {
      if (model.selectable && model.selectable.isSelected()) {
        selected.add(model);
      }
    });
    //We are getting the total selected amount by adding the differenceamount to the actual selected amount of the collection
    //The difference amount is difference between selected models of the fetched collection and the actual selection collection
    var differenceAmount = _.difference(_selected.pluck('uuid'),selected.pluck('uuid')).length;
    return differenceAmount + selected.length;
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

  this.selectModel = function (model, force) {
    if (model.get('uuid')) {
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

  this.selectModels = function (models, force) {
    this.select(new Backbone.Collection(models), force);
    console.warn('The method selectModels() is deprecated and will be removed soon. Please use the new method select');
  };

  this.select = function (selected, force) {
    if (selected instanceof Backbone.Collection) {
      selected.models.forEach(function (model) {
        this.selectModel(model, force);
      }, this);
    } else if (selected instanceof Backbone.Model) {
      this.selectModel(selected, force);
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
    _selected.add(models);
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

