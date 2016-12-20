(function (root, Backbone, $, _) {
  'use strict';

  var sync = Backbone.sync,
    mCAP = {};

  Backbone.$ = Backbone.$ || $;

  Backbone.sync = function (method, model, options) {
    if (_.isUndefined(options.wait)) {
      options.wait = true;
    }
    return sync.apply(Backbone, [method, model, options]);
  };

  mCAP.baseUrl = '';

  /**
   * Utils namespace
   * @type {Object}
   */
  mCAP.Utils = {};
  
  mCAP.Utils.getUrl = function(endpoint){
    if(endpoint.charAt(0)==='/'){
      endpoint = endpoint.substr(1);
    }
    return mCAP.baseUrl + '/' + endpoint;
  };
  /**
   * Send a request to with the given settings
   * @param settings
   * url: request URL
   * dataType: the datatype of the request - default is empty string
   * data: the data to send with the request - default is empty string
   * method: the method of the request e.g. PUT/POST/GET/DELETE
   * contentType: the contentType header
   * timeout: timeout until request expires
   * @returns {*}
   */
  mCAP.Utils.request = function (settings) {
  
    var ajaxOptions = {
      data: settings.data || {t: new Date().getTime()}
    };
  
    if(ajaxOptions.data && (settings.type === 'POST' || settings.type === 'PUT')){
      ajaxOptions.data = JSON.stringify(ajaxOptions.data);
      ajaxOptions.contentType = 'application/json';
    }
  
    ajaxOptions = _.extend(settings,ajaxOptions);
  
    return Backbone.ajax(ajaxOptions);
  };

  /*jshint unused:false */
  var Filterable = function (collectionInstance, options) {
  
    options = options || {};
  
    var _collection = collectionInstance,
        _limit = options.limit,
        _offset = _limit ? options.offset : false,
        _page = options.page || 1,
        _perPage = options.perPage || 30,
        _initialFilterValues = options.filterValues || {},
        _initialCustomUrlParams = options.customUrlParams || {},
        _filterDefinition = options.filterDefinition,
        _sortOrder = options.sortOrder,
        _totalAmount,
        _lastFilter;
  
    var _getClone = function (obj) {
      return JSON.parse(JSON.stringify(obj));
    };
  
    this.filterValues =  {};
    this.customUrlParams = {};
    this.fields = options.fields;
    this.filterIsSet = false;
  
    this.getRequestParams = function (method, model, options) {
      options = options || {};
      options.params = options.params || {};
  
      if (method === 'read') {
        // Filter functionality
        this.filterValues = _.extend({}, this.getInitialFilterValues(), this.filterValues);
        var filter = this.getFilters();
        if (filter) {
          options.params.filter = filter;
        }
  
        //reset pagination if filter values change
        if(JSON.stringify(filter) !== JSON.stringify(_lastFilter)){
          _page = 1;
        }
        _lastFilter = filter;
  
        // Pagination functionality
        if (_perPage && _page && (_limit || _.isUndefined(_limit))) {
          options.params.limit = _perPage;
  
          // Calculate offset
          options.params.offset = _page > 1 ? _perPage * (_page - 1) : 0;
        }
  
        // Sort order
        if (_sortOrder) {
          options.params.sortOrder = _sortOrder;
        }
  
        // Fallback to limit and offset if they're set manually, overwrites pagination settings
        if (_limit || _offset) {
          options.params.limit = _limit;
          options.params.offset = _offset;
        }
  
        if(_limit === false){
          delete options.params.limit;
        }
  
        if(this.fields){
          options.params.field = this.fields;
        }
  
        // Custom URL parameters
        if (this.customUrlParams) {
          _.extend(options.params, _.result(this,'customUrlParams'));
        }
  
        //always set non paged parameter
        options.params.getNonpagedCount = true;
  
        return options;
      }
    };
  
    this.getInitialFilterValues = function () {
      return _initialFilterValues;
    };
  
    this.setInitialFilterValues = function (filterValues) {
      _.extend(_initialFilterValues, filterValues);
      this.filterValues = _.extend({}, _initialFilterValues, this.filterValues);
    };
  
    this.setLimit = function(limit){
      _limit = limit;
      _offset = _offset || 0;
    };
  
    this.setTotalAmount = function (totalAmount) {
      _totalAmount = totalAmount;
    };
  
    this.getTotalAmount = function () {
      return _totalAmount;
    };
  
    this.loadPreviousPage = function () {
      _page -= 1;
      return _collection.fetch({remove: false});
    };
  
    this.hasPreviousPage = function () {
      return _page >= 1;
    };
  
    this.loadNextPage = function () {
      _page += 1;
      return _collection.fetch({remove: false});
    };
  
    this.hasNextPage = function () {
      return _totalAmount && _totalAmount > _collection.length;
    };
  
    this.getPage = function () {
      return _page;
    };
  
    this.getTotalPages = function () {
      return Math.floor(_totalAmount / _perPage);
    };
  
    this.setSortOrder = function (sortOrder) {
      _page = 1;
      _sortOrder = sortOrder;
    };
  
    this.getSortOrder = function () {
      return _sortOrder;
    };
  
    this.setFilters = function (filterMap) {
  
      _.forEach(filterMap, function (value, key) {
        if (_.has(this.filterValues, key)) {
          this.filterValues[key] = value;
        } else {
          throw new Error('Filter named \'' + key + '\' not found, did you add it to filterValues of the model?');
        }
      }, this);
  
      this.filterIsSet = true;
  
    };
  
    this.getFilters = function () {
      if (_.isFunction(_filterDefinition)) {
        return _filterDefinition.apply(this);
      }
    };
  
    this.resetFilters = function () {
      this.filterValues = _getClone(_initialFilterValues);
      this.customUrlParams = _getClone(_initialCustomUrlParams);
      this.filterIsSet = false;
    };
  
    (function _main() {
      // TODO: load persisted filters into this.filterValues and sortOrder here
      // ....
  
      if (!_collection instanceof Backbone.Collection) {
        throw new Error('First parameter has to be the instance of a collection');
      }
  
      if (options.filterValues) {
        _initialFilterValues = _getClone(options.filterValues);
      }
  
      if (options.customUrlParams) {
        _initialCustomUrlParams = _getClone(options.customUrlParams);
      }
  
      this.resetFilters();
  
    }.bind(this)());
  };
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
      if(model && model.selectable){
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
  
    var _updatePreSelectedModel = function(preSelectedModel, model){
      if(_preSelected){
        if(this.isSingleSelection()){
          _preSelected = model;
        } else {
          _preSelected.remove(preSelectedModel, {silent: true});
          _preSelected.add(model, {silent: true});
        }
      }
    };
  
    var _updateSelectedModel = function(model){
      var selectedModel = this.getSelected().get(model);
      if(selectedModel){
        _selected.remove(selectedModel, {silent: true});
        _selected.add(model, {silent: true});
        _updatePreSelectedModel.call(this,selectedModel, model);
        _setModelSelectableOptions.call(this,model,{silent: true});
      }
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
  
        model.on('change', function(model, opts){
          opts = opts || {};
         if(opts.unset || !model.id || model.id.length<1){
            this.unSelect(model);
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
      var selection = this.getSelected().clone();
      selection.each(function (model) {
        this.unSelect(model);
      },this);
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
      if (model.id) {
  
        if (!_collection.get(model) && _addPreSelectedToCollection) {
          _collection.add(model);
        }
  
        this.select(model, {force: true, silent: true});
      }
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
        _updateSelectedModel.call(this,model);
      }, this);
  
      _collection.on('remove', function (model) {
        if (_unSelectOnRemove) {
          this.unSelect(model);
        } else {
          _setModelSelectableOptions.call(this,model);
        }
      }, this);
  
      _collection.on('reset', function () {
        if (_unSelectOnRemove) {
          this.unSelectAll();
        } else {
          this.getSelected().each(function(model){
            _setModelSelectableOptions.call(this,model);
          }, this);
        }
      }, this);
  
      if (_preSelected) {
        _preselect.call(this);
      }
    };
  
    main.call(this);
  
  };
  
  mCAP.CollectionSelectable = CollectionSelectable;
  
  
  /*jshint unused:false */
  var ModelSelectable = function (modelInstance, options) {
  
    var _model = modelInstance,
        _selected = options.selected || false;
  
    this.isInCollection = false;
  
    this.hasDisabledFn = (typeof options.isDisabled === 'function') || false;
  
    this.isDisabled = function () {
      if (this.hasDisabledFn) {
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
  
    var main = function(){
      if (!(_model instanceof Backbone.Model)) {
        throw new Error('First parameter has to be the instance of a model');
      }
    };
  
    main.call(this);
  };
  
  mCAP.ModelSelectable = ModelSelectable;
  /*jshint unused:false */
  var ModelSelectable = mCAP.ModelSelectable || {},
      CollectionSelectable = mCAP.CollectionSelectable || {};
  
  _.extend(ModelSelectable.prototype, Backbone.Events);
  _.extend(CollectionSelectable.prototype, Backbone.Events);
  
  var SelectableFactory = function (instance, options) {
    if (instance instanceof Backbone.Model) {
      return new ModelSelectable(instance, options);
    } else if (instance instanceof Backbone.Collection) {
      return new CollectionSelectable(instance, options);
    } else {
      throw new Error('SelectableFactory: instance has to be either a model or a collection');
    }
  };
  
  mCAP.SelectableFactory = SelectableFactory;

  var SelectableFactory = SelectableFactory || {};
  
  var Model = Backbone.Model.extend({
  
    idAttribute: 'uuid',
    // default the model is selectable - set to false to turn selectable off
    selectable: true,
    selectableOptions: {},
    queryParameter: null,
    constructor: function (attributes, options) {
      // When a model gets removed, make sure to decrement the total count on the collection
      this.on('destroy', function () {
        if (this.collection && this.collection.filterable && this.collection.filterable.getTotalAmount() > 0) {
          this.collection.filterable.setTotalAmount(this.collection.filterable.getTotalAmount() - 1);
        }
      }, this);
  
      if (this.selectable) {
        this.selectable = new SelectableFactory(this, _.result(this, 'selectableOptions'));
      }
  
      if (typeof this.endpoint === 'string') {
        this.setEndpoint(this.endpoint);
      }
  
      /*
       * Instead of super apply we use the whole backbone constructor implementation because we need to inject
       * code inbetween which is hard to implement otherwise
       */
      var attrs = attributes || {};
  
      options = options || {};
      this.cid = _.uniqueId('c');
      this.attributes = {};
      if (options.collection) {
        this.collection = options.collection;
      }
      this._setNesting(attrs, options);
      this.changed = {};
      this.initialize.apply(this, arguments);
    },
    _setNesting: function(attrs, options){
      options = options || {};
      var nested = this.prepare();
      this.set(nested);
      if (options.parse) {
        attrs = this.parse(attrs, options) || {};
      }
      attrs = _.defaults({}, attrs, nested, _.result(this, 'defaults'));
      this.set(attrs, options);
    },
    //This method has to return an object!
    //You can do some initialisation stuff e.g. create referenced models or collections
    prepare: function () {
      /*
       * e.g.
       * return {
       *  user: new mCAP.User()
       * }
       */
      return {};
    },
  
    setQueryParameter: function (attr, value) {
      this.queryParameter = this.queryParameter || {};
      if (typeof attr === 'string') {
        this.queryParameter[attr] = value;
      }
    },
  
    removeQueryParameter: function (attr) {
      if (this.queryParameter && attr && this.queryParameter[attr]) {
        delete this.queryParameter[attr];
      }
    },
  
    getEndpoint: function () {
      return this.urlRoot();
    },
  
    setEndpoint: function (endpoint) {
      this.urlRoot = function () {
        if (mCAP.baseUrl.slice(-1) === '/' && endpoint[0] === '/') {
          return mCAP.baseUrl + endpoint.substr(1);
        } else if (mCAP.baseUrl.slice(-1) !== '/' && endpoint[0] !== '/') {
          return mCAP.baseUrl + '/' + endpoint;
        }
        return mCAP.baseUrl + endpoint;
      };
    },
  
    parse: function (response) {
      // For standalone models, parse the response
      if (response && response.data && response.data.results && response.data.results.length >= 0 && typeof response.data.results[0] !== 'undefined') {
        return response.data.results[0];
      } else if(response && response.data){
        return response.data;
      } else {
        // If Model is embedded in collection, it's already parsed correctly
        return response;
      }
    },
  
    url: function () {
      var url = Backbone.Model.prototype.url.apply(this, arguments);
      if (this.queryParameter) {
        url += '?' + Backbone.$.param(_.result(this, 'queryParameter'));
      }
      return url;
    },
  
  
    /**
     * Save the model to the server
     * @param key
     * @param val
     * @param options
     * @returns {*}
     */
  
    beforeSave: function (attributes) {
      return attributes;
    },
  
    recursiveBeforeSave: function(attr){
      var attributes = this.beforeSave(attr);
  
      var process = function(attribute){
        if(attribute instanceof Backbone.Model && typeof attribute.recursiveBeforeSave === 'function'){
          return attribute.recursiveBeforeSave(attribute.toJSON());
        } else if(attribute instanceof Backbone.Model && typeof attribute.recursiveBeforeSave !== 'function'){
          return attribute.toJSON();
        }
        if(attribute instanceof mCAP.EnumerableCollection){
          return attribute.toJSON();
        }
        if(attribute instanceof Backbone.Collection){
          var models = [];
          attribute.each(function(model){
            var x = process(model);
            models.push(x);
          });
          return models;
        }
        if(_.isArray(attribute)){
          var items = [];
          _.each(attribute, function(item){
            items.push(process(item));
          });
          return items;
        }
        if(_.isObject(attribute)){
          var obj = {};
          _.each(attribute, function(item, key){
            obj[key] = process(item);
          });
          return obj;
        }
        return attribute;
      };
  
      return process(attributes);
    },
  
    save: function () {
      var orgAttributes = this.attributes,
        orgParse = this.parse;
      this.parse = function () {
        this.attributes = orgAttributes;
        this.parse = orgParse;
        return this.parse.apply(this, arguments);
      };
      this.attributes = this.recursiveBeforeSave(_.clone(orgAttributes));
      var save = Backbone.Model.prototype.save.apply(this, arguments);
      this.attributes = orgAttributes;
      return save;
    },
  
    clear: function(options){
      var superClear = Backbone.Model.prototype.clear.apply(this, arguments);
      this._setNesting({},options);
      return superClear;
    },
  
    _triggerEvent: function (eventName, args) {
      // cast arguments to array
      var _args = Array.prototype.slice.call(args, 0);
      // add the event name
      _args.unshift(eventName);
      // trigger the event
      this.trigger.apply(this, _args);
    },
  
    sync: function () {
      if (arguments[2]) {
        //add model instance to request options
        arguments[2].instance = arguments[1];
      }
      return Backbone.Model.prototype.sync.apply(this, arguments);
    }
  
  });
  
  mCAP.Model = Model;
  var Filterable = Filterable || {},
    SelectableFactory = SelectableFactory || {};
  
  var Collection = Backbone.Collection.extend({
  
    selectable: true,
    filterable: true,
    filterableOptions: function(){
      return {};
    },
    selectableOptions: function(){
      return {};
    },
  
    model: mCAP.Model,
  
    constructor: function () {
      var superConstructor = Backbone.Collection.prototype.constructor.apply(this, arguments);
      if (this.selectable) {
        this.selectable = new SelectableFactory(this,  _.result(this,'selectableOptions'));
      }
  
      if (this.filterable) {
        this.filterable = new Filterable(this, _.result(this,'filterableOptions'));
      }
  
      if (this.endpoint) {
        this.setEndpoint(this.endpoint);
      }
  
      return superConstructor;
    },
  
    setEndpoint: function (endpoint) {
      this.url = function(){
        return URI(mCAP.baseUrl + '/' + endpoint).normalize().toString();
      };
    },
  
    parse: function (response) {
      response.data = response.data || {};
      if (this.filterable) {
        this.filterable.setTotalAmount(response.data.total || response.data.nonpagedCount || 0);
      }
      return response.data.results;
    },
  
    sync: function (method, model, options) {
      if (this.filterable) {
        var params = this.filterable.getRequestParams.apply(this.filterable, arguments);
        options = params;
      }
      return Backbone.Collection.prototype.sync.apply(this, [method, model, options]);
    },
  
    replace: function(models){
      this.reset(models);
      this.trigger('replace',this);
    }
  
  });
  
  mCAP.Collection = Collection;
  
  
  var Filterable = Filterable || {},
    SelectableFactory = SelectableFactory || {};
  
  var EnumerableCollection = mCAP.Collection.extend({
  
    selectable: false,
    filterable: false,
    defaults: function(){
      return [];
    },
    parse: function (resp) {
      var enums = [];
      _.each(resp.data, function (type) {
        enums.push({key: type.value});
      });
      return enums;
    },
    toJSON: function () {
      return this.pluck('key');
    },
    model: mCAP.Model.extend({
      idAttribute:'key'
    }),
    constructor: function(){
      var superConstructor = mCAP.Collection.prototype.constructor.apply(this,arguments),
          defaults = _.result(this, 'defaults');
  
      if(defaults.length>0){
        _.each(defaults,function(key){
          this.add({
            key: key
          });
        },this);
      }
      return superConstructor;
    }
  
  });
  
  mCAP.EnumerableCollection = EnumerableCollection;
  
  

  var Filter = function () {
    // If it is an invalid value return null otherwise the provided object
    var returnNullOrObjectFor = function (value, object) {
      return (_.isUndefined(value) || value === null || value === '' || value.length===0 || (_.isArray(value) && _.compact(value).length===0)) ? null : object;
    };
  
    // See https://wiki.mwaysolutions.com/confluence/display/mCAPTECH/mCAP+REST+API#mCAPRESTAPI-Filter
    // for more information about mCAP filter api
    return {
      containsString: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'containsString',
          fieldName: fieldName,
          contains: value
        });
      },
  
      string: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'string',
          fieldName: fieldName,
          value: value
        });
      },
  
      and: function (filters) {
        return this.logOp(filters, 'AND');
      },
  
      nand: function (filters) {
        return this.logOp(filters, 'NAND');
      },
  
      or: function (filters) {
        return this.logOp(filters, 'OR');
      },
  
      logOp: function (filters, operator) {
        filters = _.without(filters, null); // Removing null values from existing filters
  
        return filters.length === 0 ? null : { // Ignore logOps with empty filters
          type: 'logOp',
          operation: operator,
          filters: filters
        };
      },
  
      boolean: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'boolean',
          fieldName: fieldName,
          value: value
        });
      },
  
      stringMap: function (fieldName, key, value) {
        if(value === '%%'){
          value = '';
        }
        return returnNullOrObjectFor(value, {
          type: 'stringMap',
          fieldName: fieldName,
          value: value,
          key: key
        });
      },
  
      stringEnum: function (fieldName, values) {
        return returnNullOrObjectFor(values, {
          type: 'stringEnum',
          fieldName: fieldName,
          values: _.flatten(values)
        });
      },
  
      long: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'long',
          fieldName: fieldName,
          value: value
        });
      },
  
      like: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'like',
          fieldName: fieldName,
          like: value
        });
      },
  
      notNull: function (fieldName) {
        return returnNullOrObjectFor(true, {
          type: 'null',
          fieldName: fieldName
        });
      },
  
      dateRange: function(fieldName, min, max){
        return returnNullOrObjectFor(max, returnNullOrObjectFor(min, {
          type: 'dateRange',
          fieldName: fieldName,
          min: min,
          max: max
        }));
      }
    };
  
  };
  
  mCAP.Filter = Filter;
  

  root.mCAP = mCAP;

}(this, Backbone, $, _));
