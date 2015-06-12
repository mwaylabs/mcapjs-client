/*jshint unused:false */

var CollectionSelectable = function (collectionInstance, options) {
  var _collection = collectionInstance,
    _options = options || {},
    _isSingleSelection = _options.isSingleSelection || false,
    _addPreSelectedToCollection = _options.addPreSelectedToCollection || true,
    _unSelectOnRemove = _options.unSelectOnRemove,
    _preSelected = options.preSelected,
    _selected = new Backbone.Collection();

  var _preselect = function(){
    if (_preSelected instanceof Backbone.Model) {
      _isSingleSelection = true;
      console.log(this)
      this.preSelectModel(_preSelected);
    } else if (_preSelected instanceof Backbone.Collection){
      console.log('COLLECTION')
      _isSingleSelection = false;
      this.preSelectCollection(_preSelected);
    } else {
      console.log('WHAT?')
    }
  };

  this.getSelected = function () {
    return _selected;
  };

  this.getDisabled = function(){
    var disabled = _selected.clone();
    disabled.reset();
    _collection.each(function(model){
      if(model.selectable && model.selectable.isDisabled()){
        disabled.add(model);
      }
    });
    return disabled;
  };

  /**
   *
   * @param model
   */
  this.select = function (model, force) {
    if(model instanceof Backbone.Model){

      if(!(model instanceof _collection.model)){
        model = new _collection.model(model.toJSON());
      }

      if(!model.selectable || (model.selectable.isDisabled() && !force) ){
        return;
      }

      if(_isSingleSelection){
        this.reset();
      }

      model.selectable.select(true);
      _selected.add(model);
    }
  };

  this.selectAll = function(){
    _collection.each(function(model){
      this.select(model);
    }, this);
  };

  this.unSelect = function(model){
    model.selectable.unSelect();
    _selected.remove(model);
  };

  this.unSelectAll = function(){
    this.getSelected().each(function(model){
      model.selectable.unSelect();
    });
    _selected.reset();
  };

  this.toggleSelectAll = function(){
    if (this.allSelected()) {
      this.unSelectAll();
    } else {
      this.selectAll();
    }
  };

  this.allSelected = function(){
    var disabledModelsAmount = this.getDisabled().length;
    return this.getSelected().length === _collection.length - disabledModelsAmount;
  };

  this.allDisabled = function(){
    return this.getDisabled().length === _collection.length;
  };

  this.isSingleSelection = function(){
    return _isSingleSelection;
  };

  this.reset = function(){
    this.unSelectAll();
    _preselect();
  };

  this.preSelectModel = function(model){

    model.selectable.isInCollection = true;

    if(!_collection.get(model)){
      if(_addPreSelectedToCollection){
        _collection.add(model);
      } else {
        model.selectable.isInCollection = false;
      }
    }

    this.select(model, true);

    model.on('change', function(){
      this.unSelect(model);
      this.select(model, true);
    }, this);
  };

  this.preSelectCollection = function(collection){
    collection.each(function(model){
      this.preSelectModel(model);
    }, this);
    collection.on('add', function(model){
      this.preSelectModel(model);
    }, this);
    collection.on('remove', function(model){
      this.unSelect(model);
    }, this);

  };


  (function main(root) {
    if(_preSelected){
      _preselect();
    }

    _collection.on('add', function (model) {
      if (model && model.selectable) {
        model.selectable.on('change:select', function () {
          this.select(model);
        }, this);

        model.selectable.on('change:unselect', function () {
          this.unSelect(model);
        }, this);
      }
    }, root);

    _collection.on('remove', function(model){
      if(_unSelectOnRemove){
        this.unSelect(model);
      }
    }, root);

    _collection.on('reset', function(model){
      if(_unSelectOnRemove){
        this.unSelectAll();
      }
    }, root);

  })(this);

};

