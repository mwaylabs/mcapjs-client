/*jshint unused:false */

var CollectionSelectable = function (collectionInstance, options) {
  var _collection = collectionInstance,
    _options = options || {},
    _modelHasDisabledFn = true,
    _isSingleSelection = _options.isSingleSelection || false,
    _addPreSelectedToCollection = _options.addPreSelectedToCollection || false,
    _unSelectOnRemove = _options.unSelectOnRemove,
    _preSelected = options.preSelected,
    _selected = new Backbone.Collection();

  var _preselect = function () {
    if (_preSelected instanceof Backbone.Model) {
      _isSingleSelection = true;
      this.preSelectModel(_preSelected);
    } else if (_preSelected instanceof Backbone.Collection) {
      _isSingleSelection = false;
      this.preSelectCollection(_preSelected);
    } else {
      throw new Error('The option preSelected has to be either a Backbone Model or Collection');
    }
  };

  var _setModelSelectableOptions = function (model, options) {
    if(model.selectable){
      var selectedModel = _selected.get(model);

      if (selectedModel) {
        if (_collection.get(model)) {
          model.selectable.isInCollection = true;
          selectedModel.selectable.isInCollection = true;
        } else {
          model.selectable.isInCollection = false;
          selectedModel.selectable.isInCollection = false;
        }
        model.selectable.select(options);
        selectedModel.selectable.select(options);
      } else {
        model.selectable.unSelect(options);
      }

      _bindModelOnSelectListener.call(this,model);
      _bindModelOnUnSelectListener.call(this,model);
    }
  };

  var _bindModelOnSelectListener = function(model){
    this.listenTo(model.selectable, 'change:select', function(){
      if(!_selected.get(model)){
        this.select(model);
      }
    }.bind(this));
  };

  var _bindModelOnUnSelectListener = function(model){
    this.listenTo(model.selectable, 'change:unselect', function(){
      if(_selected.get(model)) {
        this.unSelect(model);
      }
    }.bind(this));
  };

  this.getSelected = function () {
    return _selected;
  };

  this.getDisabled = function () {
    var disabled = new Backbone.Collection();
    if(_modelHasDisabledFn){
      _collection.each(function (model) {
        if (model.selectable && model.selectable.isDisabled()) {
          disabled.add(model);
        }
      });
    }

    return disabled;
  };

  /**
   *
   * @param model
   */
  this.select = function (model, options) {
    options = options || {};
    if (model instanceof Backbone.Model) {
      if (!(model instanceof _collection.model)) {
        model = new _collection.model(model.toJSON());
      }

      if (!model.selectable || (model.selectable.isDisabled() && !options.force)) {
        return;
      }

      if (_isSingleSelection) {
        this.unSelectAll();
      }

      model.on('change', function(model){
        var selectedModel = _selected.get(model);
        if(model.id){
          selectedModel.set(model.toJSON());
        } else {
          this.unSelect(selectedModel);
        }
      }, this);

      _selected.add(model);
      _setModelSelectableOptions.call(this, model, options);
      this.trigger('change change:add', model, this);
    } else {
      throw new Error('The first argument has to be a Backbone Model');
    }
  };

  this.selectAll = function () {
    _collection.each(function (model) {
      this.select(model);
    }, this);
  };

  this.unSelect = function (model, options) {
    options = options || {};
    _selected.remove(model);
    _setModelSelectableOptions.call(this, model, options);
    this.trigger('change change:remove', model, this);
  };

  this.unSelectAll = function () {
    this.getSelected().each(function (model) {
      model.selectable.unSelect();
    });

    _selected.reset();
  };

  this.toggleSelectAll = function () {
    if (this.allSelected()) {
      this.unSelectAll();
    } else {
      this.selectAll();
    }
  };

  this.allSelected = function () {
    var disabledModelsAmount = this.getDisabled().length;
    return this.getSelected().length === _collection.length - disabledModelsAmount;
  };

  this.allDisabled = function () {
    return this.getDisabled().length === _collection.length;
  };

  this.isSingleSelection = function () {
    return _isSingleSelection;
  };

  this.reset = function () {
    this.unSelectAll();
    _preselect.call(this);
  };

  this.preSelectModel = function (model) {
    if (!_collection.get(model) && _addPreSelectedToCollection) {
      _collection.add(model);
    }

    this.select(model, {force: true, silent: true});
  };

  this.preSelectCollection = function (collection) {
    collection.each(function (model) {
      this.preSelectModel(model);
    }, this);

    collection.on('add', function (model) {
      this.preSelectModel(model);
    }, this);

    collection.on('remove', function (model) {
      this.unSelect(model);
    }, this);

  };


  var main = function(){
    if(!(_collection instanceof Backbone.Collection)){
      throw new Error('The first parameter has to be from type Backbone.Collection');
    }

    _collection.on('add', function (model) {
      _modelHasDisabledFn = model.selectable.hasDisabledFn;
      _setModelSelectableOptions.call(this,model);
    }, this);

    _collection.on('remove', function (model) {
      if (_unSelectOnRemove) {
        this.unSelect(model);
      }
    }, this);

    _collection.on('reset', function () {
      if (_unSelectOnRemove) {
        this.unSelectAll();
      }
    }, this);

    if (_preSelected) {
      _preselect.call(this);
    }
  };

  main.call(this);

};

