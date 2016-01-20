(function (root, Backbone, $, _) {
  'use strict';

  var sync = Backbone.sync,
    mCAP = {};

  Backbone.$ = Backbone.$ || $;

  Backbone.$.ajaxSetup({
    // send cookies
    xhrFields: { withCredentials: true }
  });

  Backbone.sync = function (method, model, options) {
    if (_.isUndefined(options.wait)) {
      options.wait = true;
    }
    return sync.apply(Backbone, [method, model, options]);
  };

  mCAP.private = {};

  //INCLUDE GLOBAL SETTINGS HERE
  // global mcap constants
  mCAP.MCAP = 'MCAP';
  mCAP.APNS = 'APNS';
  mCAP.GCM = 'GCM';
  
  // component types
  mCAP.ASSET = 'ASSET';
  mCAP.CHANNEL = 'CHANNEL';
  mCAP.PIPELINE = 'PIPELINE';
  mCAP.SERVICE_CONNECTION = 'SERVICE_CONNECTION';
  mCAP.META_MODEL = 'META_MODEL';
  mCAP.SCHEDULER_TASK = 'SCHEDULER_TASK';
  mCAP.PUSH_SERVICE = 'PUSH_SERVICE';
  
  mCAP.FILE = 'd5b8e89f-b912-4c93-a419-866445dd3df3';
  mCAP.FOLDER = '73a7cf45-10b1-4636-84c0-22b5a99692e1';
  mCAP.STUDIO = 'F4C7059E-B62B-4600-A7BC-B0CC43E75465';
  /**
   * Utils namespace
   * @type {Object}
   */
  mCAP.Utils = {};
  
  mCAP.Utils.getUrl = function(endpoint){
    if(endpoint.charAt(0)==='/'){
      endpoint = endpoint.substr(1);
    }
    return mCAP.application.get('baseUrl') + '/' + endpoint;
  };
  
  /**
   * Returns the component type enum of the given model
   * Compare the return value with an mCAP constant/global
   * @param model
   * @returns {string}
   */
  mCAP.Utils.getComponentType = function (model) {
    if(mCAP.PushApp.prototype.isPrototypeOf(model)){
      return mCAP.PUSH_SERVICE;
    }
  };
  
  
  mCAP.Utils.setAuthenticationEvent = function(options){
    var error = options.error;
    options.error = function(xhr, state, resp){
      if(xhr.status === 401){
        mCAP.authentication._triggerEvent('unauthorized', arguments);
      }
      if(typeof error === 'function'){
        error(xhr, state, resp);
      }
    };
    return options;
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

  // INCLUDE PRIVATE VARS HERE
  /*jshint unused:false */
  var Filterable = function (collectionInstance, options) {
  
    options = options || {};
  
    var _collection = collectionInstance,
        _limit = options.limit,
        _offset = _limit ? options.offset : false,
        _page = options.page || 1,
        _perPage = options.perPage || 30,
        _initialFilterValues = options.filterValues ? JSON.parse(JSON.stringify(options.filterValues)) : options.filterValues,
        _initialCustomUrlParams = _.clone(options.customUrlParams),
        _filterDefinition = options.filterDefinition,
        _sortOrder = options.sortOrder,
        _totalAmount,
        _lastFilter;
  
    this.filterValues = options.filterValues || {};
    this.customUrlParams = options.customUrlParams || {};
    this.fields = options.fields;
    this.filterIsSet = false;
  
    this.getRequestParams = function (method, model, options) {
      options.params = options.params || {};
  
      if (method === 'read') {
        // Filter functionality
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
      this.filterValues = _initialFilterValues ? JSON.parse(JSON.stringify(_initialFilterValues)) : _initialFilterValues;
      this.customUrlParams = _initialCustomUrlParams;
      this.filterIsSet = false;
    };
  
    (function _main() {
      // TODO: load persisted filters into this.filterValues and sortOrder here
      // ....
  
      if (!_collection instanceof Backbone.Collection) {
        throw new Error('First parameter has to be the instance of a collection');
      }
  
    }());
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
  /*jshint unused:false */
  var ModelSelectable = ModelSelectable || {},
      CollectionSelectable = CollectionSelectable || {};
  
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

  // INCLUDE mCAP PUBLIC VARS HERE
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
        if (mCAP.application.get('baseUrl').slice(-1) === '/' && endpoint[0] === '/') {
          return mCAP.application.get('baseUrl') + endpoint.substr(1);
        } else if (mCAP.application.get('baseUrl').slice(-1) !== '/' && endpoint[0] !== '/') {
          return mCAP.application.get('baseUrl') + '/' + endpoint;
        }
        return mCAP.application.get('baseUrl') + endpoint;
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
        if(attribute instanceof Backbone.Model){
          return attribute.recursiveBeforeSave(attribute.toJSON());
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
        mCAP.Utils.setAuthenticationEvent(arguments[2]);
        //add model instance to request options
        arguments[2].instance = arguments[1];
      }
      return Backbone.Model.prototype.sync.apply(this, arguments);
    }
  
  });
  
  mCAP.Model = Model;
  /**
   * The Component Model - extends the mCAP.Model with a version number
   */
  var Component = mCAP.Model.extend({
  
    endpoint: '/',
  
    defaults: {
      uuid: null,
      version: -1
    },
  
    increaseVersionNumber: function () {
      this.attributes.version += 1;
    },
  
    decreaseVersionNumber: function () {
      this.attributes.version -= 1;
    },
  
    /**
     * Update version number on save
     * @param key
     * @param val
     * @param options
     * @returns {Array}
     * @private
     */
    save: function (key, val, options) {
      // prepare options
      // needs to be == not === because backbone has the same check. If key is undefined the check will fail with === but jshint does not allow == so this is the workaround to   key == null || typeof key === 'object'
      if (typeof key === 'undefined' || key === void 0 || key === null || typeof key === 'object') {
        options = val;
      }
      // make sure options are defined
      options = _.extend({validate: true}, options);
      // cache success
      var error = options.error;
      // cache model
      var model = this;
  
      model.increaseVersionNumber();
      // overwrite error
      options.error = function (resp) {
        model.decreaseVersionNumber();
        // call cached success
        if (error) {
          error(model, resp, options);
        }
      };
  
      // make sure options are the correct paramater
      // needs to be == not === because backbone has the same check. If key is undefined the check will fail with === but jshint does not allow == so this is the workaround to   key == null || typeof key === 'object'
      if (typeof key === 'undefined' || key === void 0 || key === null || typeof key === 'object') {
        val = options;
      }
      return mCAP.Model.prototype.save.call(this, key, val, options);
    }
  
  });
  
  mCAP.Component = Component;
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
        return URI(mCAP.application.get('baseUrl') + '/' + endpoint).normalize().toString();
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
      options = mCAP.Utils.setAuthenticationEvent(options);
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
  
  
  var Application = mCAP.Model.extend({
  
    defaults: {
      'baseUrl': '',
      'pushServiceApiVersion': 'v1'
    }
  
  });
  
  mCAP.application = new Application();
  var Countries = mCAP.Collection.extend({
  
    endpoint: 'gofer/form/rest/enumerables/pairs/localeCountries',
  
    model: mCAP.Model.extend({
      idAttribute: 'value'
    }),
  
    parse: function (resp) {
      return resp.data;
    }
  
  });
  
  mCAP.Countries = Countries;
  var PasscodePolicy = mCAP.Model.extend({
  
    defaults: function(){
      return {
        allowSimplePassword: false,
        maximumPasswordAge: 0,
        minimumNumbersOfDigits: 0,
        minimumNumbersOfLowerCaseLetters: 0,
        minimumNumbersOfUpperCaseLetters: 0,
        minimumPasswordLength: 8,
        requiredNumbersOfSymbols: 0
      };
    },
  
    _test: function(val, regex, amount){
      if(amount === 0){
        return true;
      } else if(val){
        var match = val.match(regex);
        return match && match.length>=amount;
      }
    },
  
    hasEnoughLowerCaseLetters: function(val){
      var minLowerCase = this.get('minimumNumbersOfLowerCaseLetters');
      return this._test(val,/[a-z]/g,minLowerCase);
    },
    hasEnoughUpperCaseLetters: function(val){
      var minUpperCase = this.get('minimumNumbersOfUpperCaseLetters');
      return this._test(val,/[A-Z]/g,minUpperCase);
    },
    hasEnoughDigits: function(val){
      var minDigits = this.get('minimumNumbersOfDigits');
      return this._test(val,/[0-9]/g,minDigits);
    },
    hasEnoughSymbols: function(val){
      var minSymbols = this.get('requiredNumbersOfSymbols');
      return this._test(val,/\W/g,minSymbols);
    },
    isLongEnough: function(val){
      var minLength = this.get('minimumPasswordLength');
      return val && val.length>=minLength;
    },
    isSimple: function(val, user, organisation){
      var checkOrganisation = organisation || window.mCAP.currentOrganization,
        checkUser = user || window.mCAP.authenticatedUser;
  
      if(checkOrganisation.get('uniqueName') && checkUser.get('name')){
        var orgaName = checkOrganisation.get('uniqueName'),
          userName = checkUser.get('name');
  
        return val === orgaName || val === userName;
      } else {
        return false;
      }
    },
    violatesSimpleRestriction: function(val, checkUser, checkOrganisation){
      if(!this.get('allowSimplePassword')){
        return this.isSimple(val, checkUser, checkOrganisation);
      } else {
        return false;
      }
    },
    getExamplePassword: function () {
      var letters = 'abcdefghijklmnopqrstuvwxyz',
        numbers = '0123456789',
        symbols = '!"§$%&/()=?€@+*#,;-',
        minNumOfDigits = this.get('minimumNumbersOfDigits'),
        minNumOfLowerCaseLetters = this.get('minimumNumbersOfLowerCaseLetters'),
        minNumOfUpperCaseLetters = this.get('minimumNumbersOfUpperCaseLetters'),
        minNumOfSymbols = this.get('requiredNumbersOfSymbols'),
        minLength = this.get('minimumPasswordLength'),
        password = '';
  
      for (var a = 0; a < minNumOfDigits; a++) {
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
  
      for (var b = 0; b < minNumOfSymbols; b++) {
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
      }
  
      for (var c = 0; c < minNumOfUpperCaseLetters; c++) {
        password += letters.charAt(Math.floor(Math.random() * letters.length)).toUpperCase();
      }
  
      for (var d = 0; d < minNumOfLowerCaseLetters; d++) {
        password += letters.charAt(Math.floor(Math.random() * letters.length));
      }
  
      if (password.length < minLength) {
        var fillUpLength = minLength - password.length;
        for (var e = 0; e < fillUpLength; e++) {
          password += letters.charAt(Math.floor(Math.random() * letters.length));
        }
      }
  
      return _.shuffle(password.split('')).join('');
    }
  });
  
  mCAP.PasscodePolicy = PasscodePolicy;
  
  var Organization = mCAP.Model.extend({
  
    endpoint: 'gofer/security/rest/organizations',
  
    defaults: function () {
      return {
        name: '',
        uniqueName: ''
      };
    },
  
    prepare: function () {
      return {
        passcodePolicy: new mCAP.PasscodePolicy(),
        user: new ( mCAP.User.extend({
          prepare: function () {
            return {
              groups: new mCAP.Groups()
            };
          },
          initialize: function () {}
        }) )()
      };
    },
  
    beforeSave: function (attrs) {
      attrs.passwordPolicy = this.get('passcodePolicy').toJSON();
      delete attrs.passcodePolicy;
  
      if (this.isNew()) {
        attrs.orgaName = attrs.uniqueName;
        attrs.orgaFullName = attrs.name;
        attrs.orgaContactName = this.get('user').getFullName();
        attrs.orgaContactEMail = this.get('user').get('email');
  
        attrs.orgaAdminUser = this.get('user').get('name');
        attrs.orgaAdminGivenName = this.get('user').get('givenName');
        attrs.orgaAdminSurName = this.get('user').get('surname');
        attrs.orgaAdminPwd = this.get('user').get('password');
        attrs.orgaAdminEmail = this.get('user').get('email');
      }
  
      delete attrs.user;
  
      return attrs;
    },
  
    setReferencedCollections: function (attrs) {
  
      if (attrs.passwordPolicy && !(attrs.passwordPolicy instanceof mCAP.PasscodePolicy) && this.get('passcodePolicy')) {
        this.get('passcodePolicy').set(attrs.passwordPolicy);
        delete attrs.passwordPolicy;
      }
  
      if (attrs.createdUser) {
        this.get('user').set('uuid', attrs.createdUser);
      }
  
      return attrs;
    },
  
    set: function (key, val, options) {
      key = this.setReferencedCollections(key);
      return mCAP.Model.prototype.set.apply(this, [key, val, options]);
    },
  
    parse: function () {
      var data = mCAP.Model.prototype.parse.apply(this, arguments);
      if(data.orgaId){
        data.uuid = data.orgaId;
        delete data.orgaId;
      }
      if(data.orgaName){
        data.uniqueName = data.orgaName;
        delete data.orgaName;
      }
      return this.setReferencedCollections(data);
    },
  
    save: function () {
      var endPoint = this.getEndpoint();
      if (this.isNew()) {
        this.setEndpoint('relution/api/v1/wizard');
      }
      return mCAP.Model.prototype.save.apply(this, arguments).then(function (model) {
        this.setEndpoint(endPoint);
        return model;
      }.bind(this));
    },
  
    destroy: function () {
      var endPoint = this.getEndpoint();
      this.setEndpoint('relution/api/v1/cleanup');
      return mCAP.Model.prototype.destroy.apply(this, arguments).then(function (model) {
        this.setEndpoint(endPoint);
        return model;
      }.bind(this));
    }
  
  });
  
  mCAP.Organization = Organization;
  
  var CurrentOrganization = mCAP.Organization.extend({
  
    sync: function(){
      var fetchArgs = arguments;
      if (!this.get('uuid')) {
        var dfd = new window.Backbone.$.Deferred();
        mCAP.currentOrganization.once('change:uuid', function () {
          this.initialize();
          mCAP.Organization.prototype.sync.apply(this, fetchArgs).then(
            function (rspModel) {
              dfd.resolve(rspModel);
            },
            function (rsp) {
              dfd.reject(rsp);
            });
        }, this);
        return dfd.promise();
      } else {
        return mCAP.Organization.prototype.sync.apply(this, arguments);
      }
    },
  
    initialize: function(){
      this.set('uuid', mCAP.currentOrganization.get('uuid'));
    }
  });
  
  mCAP.CurrentOrganization = CurrentOrganization;
  
  var Organizations = mCAP.Collection.extend({
  
    endpoint: 'gofer/security/rest/organizations',
  
    model: mCAP.Organization,
  
    parse: function (resp) {
      return resp.data.items;
    },
  
    filterableOptions: function(){
      return {
        sortOrder:'+name',
        filterValues: {
          search: '',
          strictSearch: false,
          name: ''
        },
        customUrlParams:{
          getNonpagedCount:true
        },
        filterDefinition: function () {
          var filter = new mCAP.Filter(),
            generalFilters = [],
            searchFilters;
  
          if(this.filterValues.strictSearch){
            generalFilters.push(filter.string('uniqueName', this.filterValues.name));
          } else {
            generalFilters.push(filter.containsString('uniqueName', this.filterValues.name));
          }
  
          searchFilters = [
            filter.containsString('name', this.filterValues.search),
            filter.containsString('uniqueName', this.filterValues.search)
          ];
  
          generalFilters.push(filter.or(searchFilters));
  
          return filter.and(generalFilters);
        }
      };
    }
  
  });
  
  mCAP.Organizations = Organizations;
  var UsersAndGroupsHolderModel = mCAP.Model.extend({
  
    endpoint: 'gofer/form/rest/enumerables/paginatedPairs/roles',
  
    prepare: function(){
      return {
        users:new mCAP.Users(),
        groups:new mCAP.Groups()
      };
    },
  
    setReferencedCollections: function(attrs){
  
      var users = _.findWhere(attrs,{type:'USER'}),
        groups = _.findWhere(attrs,{type:'GROUP'});
  
      if(users || groups){
        if (!(attrs.users instanceof mCAP.Users) && this.get('users') && users) {
          this.get('users').add(_.where(attrs,{type:'USER'}));
        }
  
        if (!(attrs.groups instanceof mCAP.Groups) && this.get('groups') && groups) {
          this.get('groups').add(_.where(attrs,{type:'GROUP'}));
        }
        return;
      } else {
        return attrs;
      }
    },
  
    parse: function () {
      var data = mCAP.Model.prototype.parse.apply(this,arguments);
      return this.setReferencedCollections(data);
    },
  
    set: function (key, val, options) {
      key = this.setReferencedCollections(key);
      return mCAP.Model.prototype.set.apply(this, [key, val, options]);
    }
  
  });
  
  var Group = mCAP.Model.extend({
  
    endpoint: 'gofer/security/rest/groups',
  
    defaults: function(){
      return {
        uuid: null,
        name: '',
        version: 0,
        description: null,
        roles: null,
        members: null,
        aclEntries: [],
        effectivePermissions: '',
        sysRoles: [],
        systemPermission: false,
        bundle: null
      };
    },
  
    prepare: function(){
      return {
        roles: new UsersAndGroupsHolderModel(),
        members: new UsersAndGroupsHolderModel(),
        organization: new mCAP.Organization()
      };
    },
  
    validate: function(attributes){
      if(!attributes.organizationUuid || attributes.organizationUuid.length<1){
        return 'Missing organization uuid';
      }
    },
  
    beforeSave: function(data){
      data.organizationUuid = this.get('organization').get('uuid');
      delete data.organization;
  
      if(data.roles){
        data.roles = _.union(this.get('roles').get('users').pluck('uuid'),this.get('roles').get('groups').pluck('uuid'));
      }
  
      if(data.members){
        data.members = _.union(this.get('members').get('users').pluck('uuid'),this.get('members').get('groups').pluck('uuid'));
      }
  
      return data;
    },
  
    setReferencedCollections: function(attrs){
      if(attrs.organizationUuid){
        this.get('organization').set({uuid:attrs.organizationUuid});
        delete attrs.organizationUuid;
      }
  
      if(attrs.rolesObjects){
        this.get('roles').set(attrs.rolesObjects);
        delete attrs.rolesObjects;
        delete attrs.roles;
      }
  
      if(attrs.membersObjects){
        this.get('members').set(attrs.membersObjects);
        delete attrs.membersObjects;
        delete attrs.members;
      }
  
      //if(attrs.members && !(attrs.members instanceof mCAP.Members) && this.get('members')){
      //  attrs.members.forEach(function(member){
      //    this.get('members').add(member);
      //  },this);
      //  delete attrs.members;
      //}
  
      return attrs;
    },
  
    set: function(key, val, options){
      key = this.setReferencedCollections(key);
      return mCAP.Model.prototype.set.apply(this,[key, val, options]);
    },
  
    parse: function (attrs) {
      attrs = attrs.data || attrs;
      return this.setReferencedCollections(attrs);
    },
  
    initialize: function(){
      this.get('organization').set({uuid:mCAP.currentOrganization.get('uuid')});
      mCAP.currentOrganization.on('change',function(){
        if(!this.get('organization').get('uuid')){
          this.get('organization').set({uuid:mCAP.currentOrganization.get('uuid')});
        }
      },this);
    },
  
    isSystemGroup: function(){
      var groupType = this.get('groupType');
      return groupType === 'SYSTEM_GROUP' || groupType === 'SYSTEM_PERMISSION';
    }
  
  });
  
  mCAP.Group = Group;
  
  var Groups = mCAP.Collection.extend({
  
    endpoint: 'gofer/security/rest/groups',
  
    model: mCAP.Group,
  
    parse: function (resp) {
      this.filterable.setTotalAmount(resp.data.nonpagedCount);
      return resp.data.items;
    },
  
    filterableOptions: function () {
      return {
        sortOrder: '+name',
        filterValues: {
          name: '',
          uuid: '',
          groupType: '',
          members: [],
          strictSearch: false,
          organizationUuid: ''
        },
        customUrlParams:{
          getNonpagedCount:true
        },
        fields:['uuid','name','description','readonly','groupType'],
        filterDefinition: function () {
          var filter = new mCAP.Filter();
  
          var filters = [];
  
          if(this.filterValues.strictSearch){
            filters.push(filter.string('name', this.filterValues.name));
          } else {
            filters.push(filter.containsString('name', this.filterValues.name));
          }
  
          if (this.filterValues.groupType === '') {
            filters.push(filter.stringEnum('groupType', ['GROUP','SYSTEM_GROUP']));
          } else {
            filters.push(filter.stringEnum('groupType', this.filterValues.groupType));
          }
  
          filters.push(filter.string('members',this.filterValues.members));
          filters.push(filter.string('uuid',this.filterValues.uuid));
          filters.push(filter.string('organizationUuid',this.filterValues.organizationUuid));
          return filter.and(filters);
        }
      };
    },
    systemGroupIsSelected: function(){
      var systemGroupInSelection = false;
      this.selectable.getSelected().each(function(model){
        if(!systemGroupInSelection){
          systemGroupInSelection = model.isSystemGroup();
        }
      });
      return systemGroupInSelection;
    }
  });
  
  mCAP.Groups = Groups;
  
  var User = mCAP.Model.extend({
  
    endpoint: 'gofer/security/rest/users',
  
    defaults: function () {
      return {
        'uuid': null,
        'name': '',
        'salutation': null,
        'givenName': '',
        'surname': '',
        'position': null,
        'email': '',
        'phone': null,
        'country': null,
        'password': '',
        'locked': false,
        'activated': true,
        'version': 0,
        'aclEntries': [],
        'groups': null
      };
    },
  
    prepare: function () {
      return {
        groups: new mCAP.Groups(),
        organization: new mCAP.Organization()
      };
    },
  
    beforeSave: function (attributes) {
      attributes.roles = this.get('groups').pluck('uuid');
      attributes.organizationUuid = this.get('organization').get('uuid');
  
      delete attributes.groups;
      delete attributes.organization;
      delete attributes.authenticated;
      if (attributes.password === '' || attributes.password === null) {
        delete attributes.password;
      }
      if (attributes.phone === '' || attributes.phone === null) {
        delete attributes.phone;
      }
  
      return attributes;
    },
  
    setReferencedCollections: function(obj){
      if(obj.organizationUuid){
        this.get('organization').set({uuid: attrs.organizationUuid});
        delete obj.organizationUuid;
      }
  
      if( obj.rolesObjects && !(obj.rolesObjects instanceof mCAP.Groups) && this.get('groups')){
        this.get('groups').add(obj.rolesObjects);
        delete obj.rolesObjects;
        delete obj.roles;
      }
  
      if( obj.roles && !(obj.roles instanceof mCAP.Groups) && this.get('groups')){
        this.get('groups').add(obj.roles);
        delete obj.roles;
      }
  
      return obj;
    },
  
    parse: function (resp) {
      var data = resp.data || resp;
      this.get('organization').set('uuid', data.organizationUuid);
      delete data.organizationUuid;
      return this.setReferencedCollections(data);
    },
  
    set: function(key, val, options){
      key = this.setReferencedCollections(key);
      return mCAP.Model.prototype.set.apply(this,[key, val, options]);
    },
  
    loginAs: function(){
      var options = {
        url: 'gofer/security-login-as',
        type: 'GET',
        //jshint -W106
        params: {
          j_user_uuid: this.get('uuid')
        },
        //jshint +W106
        instance: this
      };
      return window.mCAP.Utils.request(options);
    },
  
    resetPassword: function(){
      var options = {
        url: this.getEndpoint() + '/createPasswordResetRequest',
        type: 'PUT',
        params: {
          userIdentifier: this.get('name'),
          organizationName: mCAP.currentOrganization.get('uniqueName')
        },
        instance: this
      };
      return window.mCAP.Utils.request(options);
    },
  
    changePassword: function(newPassword){
      var options = {
          url: this.getEndpoint() + '/' + this.get('uuid') + '/changePassword',
          type: 'PUT',
          data: {
            newPassword: newPassword
          },
          instance: this
        };
      return window.mCAP.Utils.request(options);
    },
  
    isLocked: function(){
      return (this.get('readonly') || this.get('locked'));
    },
  
    getFullName: function(){
      if(this.get('givenName') && this.get('surname')){
        return this.get('givenName')+' '+this.get('surname');
      } else if(this.get('name')){
        return this.get('name');
      } else {
        return false;
      }
    },
  
    initialize: function () {
      this.get('organization').set('uuid', mCAP.currentOrganization.get('uuid'));
      mCAP.currentOrganization.once('change:uuid', function (model) {
        if(model.id){
          this.get('organization').set('uuid', model.id);
        }
      }, this);
    }
  
  });
  
  mCAP.User = User;
  
  var Users = mCAP.Collection.extend({
  
    endpoint: 'gofer/security/rest/users',
  
    model: mCAP.User,
  
    parse: function(resp){
      if(this.filterable){
        this.filterable.setTotalAmount(resp.data.nonpagedCount);
      }
      return resp.data.items;
    },
  
    filterableOptions: function(){
      return {
        sortOrder:'+name',
        filterValues: {
          search: '',
          strictSearch: false,
          name: '',
          organisationUuid: ''
        },
        customUrlParams:{
          getNonpagedCount:true
        },
        filterDefinition: function () {
          var filter = new mCAP.Filter(),
              generalFilters = [],
              searchFilters;
  
          if(this.filterValues.strictSearch){
            generalFilters.push(filter.string('name', this.filterValues.name));
          } else {
            generalFilters.push(filter.containsString('name', this.filterValues.name));
          }
  
          generalFilters.push(filter.string('organizationUuid', this.filterValues.organisationUuid));
  
          searchFilters = [
            filter.containsString('name', this.filterValues.search),
            filter.containsString('givenName', this.filterValues.search),
            filter.containsString('surname', this.filterValues.search),
            filter.containsString('email', this.filterValues.search)
          ];
  
          generalFilters.push(filter.or(searchFilters));
  
          return filter.and(generalFilters);
        }
      };
    }
  
  });
  
  mCAP.Users = Users;
  /**
   * mCAP Authentication
   */
  var UserPreferences = mCAP.Model.extend({
    hasPreferences: true,
    setUserId: function (userId) {
      this.setEndpoint('gofer/security/rest/users/' + userId + '/preferences');
    },
    parse: function (attrs) {
      return attrs.data;
    },
    save: function (options) {
      return Backbone.ajax(_.extend({
        url: _.result(this, 'url'),
        data: this.toJSON(),
        type: 'PUT'
      }, options));
    }
  });
  
  var AuthenticatedUser = mCAP.User.extend({
    defaults: function(){
      return _.extend(mCAP.User.prototype.defaults.apply(this,arguments),{
        authenticated: false
      });
    },
    prepare: function(){
      var user =  mCAP.User.prototype.prepare.apply(this,arguments);
      return _.extend(user,{
        preferences: new UserPreferences()
      });
    },
    changePassword: function (oldPassword, newPassword) {
      return Backbone.ajax({
        url: this.url()+'/changePassword',
        data: {
          password: oldPassword,
          newPassword: newPassword
        },
        type: 'PUT'
      });
    },
    beforeSave: function(attrs){
      delete attrs.preferences;
      return mCAP.User.prototype.beforeSave.call(this,attrs);
    },
    set: function (key, val, options) {
      key = this.setReferencedCollections(key);
      return mCAP.User.prototype.set.apply(this, [key, val, options]);
    },
    setReferencedCollections: function (attr) {
      mCAP.User.prototype.setReferencedCollections.apply(this, [attr]);
  
      if (attr.preferences && !(attr.preferences instanceof mCAP.Model) && this.get('preferences')) {
        this.get('preferences').set(attr.preferences);
        this.get('preferences').hasPreferences = true;
        delete attr.preferences;
      }
  
      //special case for LDAP users
      if(attr.preferences === null){
        this.get('preferences').hasPreferences = false;
        delete attr.preferences;
      }
  
      if (attr.organization && !(attr.organization instanceof mCAP.Model) && this.get('organization')) {
        this.get('organization').set(attr.organization);
        delete attr.organization;
      }
  
      if (attr.organization === null){
        delete attr.organization;
      }
  
      return attr;
    },
    parse: function (resp) {
      var parsedResp = mCAP.User.prototype.parse.apply(this, [resp]);
      return this.setReferencedCollections(parsedResp);
    },
    initialize: function () {
      this.on('change:'+this.idAttribute, function (model) {
        if(model && model.id){
          this.get('preferences').setUserId(model.id);
          this.set('authenticated',true);
        }
      }, this);
    }
  });
  
  mCAP.private.UserPreferences = UserPreferences;
  mCAP.private.AuthenticatedUser = AuthenticatedUser;
  
  var Authentication = mCAP.Model.extend({
  
    defaults: {
      'user': null,
      'authenticated': false
    },
  
    endpoint: 'gofer/security/rest/auth/',
  
    prepare: function () {
      return {
        user: new mCAP.private.AuthenticatedUser()
      };
    },
  
    /**
     * Perform a logout request against the server configured with mCAP.application.set('baseUrl', 'https://server.com');
     * Fires a logout event everytime a login is performed.
     * @returns promise
     * @example
     * mCAP.authentication.logout().always(function(){});
     * mCAP.authentication.on('logout', function(obj){});
     */
    logout: function () {
      var self = this;
      return mCAP.Utils.request({
        url: this.url() + 'logout',
        type: 'POST'
      }).always(function () {
        self.set({authenticated:false});
        self.set('user', new mCAP.private.AuthenticatedUser());
        mCAP.authenticatedUser = mCAP.authentication.get('user');
        mCAP.currentOrganization = mCAP.authentication.get('user').get('organization');
        self._triggerEvent('logout', arguments);
      });
    },
  
    setReferencedModels: function (obj) {
      if (obj.user && !(obj.user instanceof mCAP.private.AuthenticatedUser) && this.get('user')) {
        this.get('user').set(obj.user);
        delete obj.user;
      }
  
      if (obj.organization && !(obj.organization instanceof mCAP.Organization) && this.get('user').get('organization')) {
        this.get('user').get('organization').set(obj.organization);
        delete obj.organization;
      }
      return obj;
    },
  
    /**
     * Takes the arguments from the server and builds objects needed on the client side
     * @private
     * @param data
     * @returns {{}}
     */
    parse: function (data) {
      return this.setReferencedModels(data);
    },
  
    set: function (key, val, options) {
      key = this.setReferencedModels(key);
      return mCAP.Model.prototype.set.apply(this, [key, val, options]);
    },
  
    /**
     * Check if the current user is authenticated or not. Resolves if it is the case otherwise its rejected.
     * @returns {promise}
     * @example
     * mCAP.authentication.isAuthenticated().then(function(){
              console.log('is authenticated');
          }).fail(function(){
              console.log('is not authenticated');
          });
     */
    isAuthenticated: function () {
      var dfd = $.Deferred(),
        self = this;
  
      mCAP.Utils.request({
        url: mCAP.Utils.getUrl('/gofer/system/security/currentAuthorization'),
        type: 'GET'
      }).then(function (resp) {
        // resolve only if the current user is authenticated
        if (resp.data.user && resp.data.user.uuid) {
          self.set({authenticated:true});
          dfd.resolve(self);
        }
        self.set({authenticated:false});
        // otherwise reject
        dfd.reject('not authenticated', resp.data);
        return;
      }, function(err){
        dfd.reject(err);
      });
      return dfd.promise();
    },
  
    initialize: function () {
  //    this.on('change', function () {
  //      mCAP.authenticatedUser.set(this.get('user'));
  //    },this);
    }
  
  }, {
    requestNewPassword: function (userName, organizationName) {
      return mCAP.Utils.request({
        url: mCAP.Utils.getUrl('/gofer/security/rest/users/requestNewPassword'),
        data: {
          userIdentifier: userName,
          organizationName: organizationName
        },
        type: 'PUT'
      });
    },
    resetPassword: function (newPassword, requestUuid, options) {
      var config = {
        url: mCAP.Utils.getUrl('/gofer/security/rest/users/resetPasswordSafely'),
        data: {
          newPassword: newPassword,
          requestUuid: requestUuid
        },
        type: 'PUT'
      };
      _.extend(config, options);
      return mCAP.Utils.request(config);
    },
    login: function (userName, password, organizationName) {
      return mCAP.Utils.request({
        url: mCAP.Utils.getUrl(Authentication.prototype.endpoint + 'login'),
        data: {
          'userName': (organizationName ? organizationName + '\\' : '') + userName,
          'password': password
        },
        type: 'POST'
      }).then(function (response) {
        mCAP.authentication.set({authenticated:true});
        mCAP.authentication.set(response);
        return mCAP.authentication;
      });
    }
  });
  
  // API
  mCAP.authentication = new Authentication();
  mCAP.Authentication = Authentication;
  mCAP.authenticatedUser = mCAP.authentication.get('user');
  mCAP.currentOrganization = mCAP.authentication.get('user').get('organization');
  
  Authentication.prototype.initialize = function () {
    throw new Error('You can not instantiate a second Authentication object please use the mCAP.authentication instance');
  };
  

  /**
   * Base object collection for all push collections
   */
  var PushAppAttributeCollection = mCAP.Collection.extend({
  
    endpoint: '',
  
    /**
     * The push app API
     * @type {Object}
     */
    push: null,
  
    setEndpoint: function (endpoint) {
      this.url = function () {
        // take the 'parent' url and append the own endpoint
        return URI(this.push.url() + endpoint).normalize().toString();
      };
    },
  
    /**
     * The push param needs to implement an url function. This is needed to build the own URL of the Collection.
     * @param push
     * @returns {*}
     */
    initialize: function (child, push) {
      this.push = push;
      return mCAP.Collection.prototype.initialize.apply(this, arguments);
    }
  
  });
  
  mCAP.PushAppAttributeCollection = PushAppAttributeCollection;
  /**
   * Device Model
   */
  var Device = mCAP.Model.extend({
  
    idAttribute: 'uuid',
  
    defaults: {
      'providerType': mCAP.MCAP, // mCAP.GCM, mCAP.APNS
      'user': '',
      'vendor': '',
      'name': '',
      'osVersion': '',
      'language': 'de',
      'country': 'DE',
      'tags': null,
      'badge': 0,
      'appPackageName': null, // bundleIdentifier
      'type': null, // smartphone or tablet
      'appVersion': null,
      'model': null,
      'attributes': null, // string to string hashmap {"key": "value"}
      'token': ''
    },
  
    initialize: function (options) {
      this.attributes.tags = options.tags || [];
      this.attributes.attributes = options.attributes || {};
      return mCAP.Model.prototype.initialize.apply(this, arguments);
    }
  
  });
  
  mCAP.Device = Device;
  /**
   * Device Collection
   */
  var Devices = mCAP.PushAppAttributeCollection.extend({
  
    endpoint: '/devices',
  
    model: mCAP.Device,
  
    parse: function (data) {
      if (data && data.items) {
        return data.items;
      }
      return data;
    }
  });
  
  mCAP.Devices = Devices;
  /**
   * Push Job Model
   */
  var Job = mCAP.Model.extend({
  
    idAttribute: 'uuid',
  
    defaults: {
      'message': '',
      'sound': '',
      'deviceFilter': null,
      'badge': 0,
      'extras': null
    },
  
    sendPush: function(){
      return this.save.apply(this, arguments);
    }
  
  });
  
  mCAP.Job = Job;
  
  /**
   * Push Job Collection
   */
  var Jobs = mCAP.PushAppAttributeCollection.extend({
  
    endpoint: '/jobs',
  
    model: mCAP.Job,
  
    parse: function( data ){
      if (data && data.items) {
        return data.items;
      }
      return data;
    }
  });
  
  mCAP.Jobs = Jobs;
  /**
   * Tags collection
   * @example
   * mCAP.push.tags.tags
   */
  var Tags = mCAP.PushAppAttributeCollection.extend({
  
    /**
     * There is no model caused by the server response. The server just returns an string array with all tags.
     * @type {Array}
     */
    tags: null,
  
    endpoint: '/tags',
  
    /**
     * Tags are a simple string array - so there is no model
     * @param data
     */
    parse: function (data) {
      // set the tags
      this.tags = data;
    },
  
    /**
     * Caused by no model the get is overwritten to be API compliant.
     * @param key
     * @returns {*}
     */
    get: function(key){
      if(key === 'tag' || key === 'tags'){
        return this.tags;
      } else {
        return mCAP.PushAppAttributeCollection.prototype.get.apply(this, arguments);
      }
    },
  
    /**
     * Caused by no model the get is overwritten to be API compliant.
     * @param key
     * @returns {*}
     */
    set: function(key, val){
      if(key === 'tag' || key === 'tags'){
        this.tags = val;
        return this;
      } else {
        return mCAP.PushAppAttributeCollection.prototype.set.apply(this, arguments);
      }
    }
  
  });
  
  mCAP.Tags = Tags;
  /**
   * ApnsProvider
   */
  var ApnsProvider = mCAP.Model.extend({
  
    endpoint: '/apnsProvider',
  
    defaults: {
      'certificate': null,
      'passphrase': null
    },
  
    initialize: function (child, push) {
      this.push = push;
      return mCAP.Model.prototype.initialize.apply(this, arguments);
    },
  
    upload: function () {
      return this.sync();
    },
  
    setEndpoint: function (endpoint) {
      this.url = function () {
        // take the 'parent' url and append the own endpoint
        return URI(this.push.url() + endpoint).normalize().toString();
      };
    },
  
    sync: function (method, model, options) {
  
      model = model || this;
      // Post data as FormData object on create to allow file upload
  
      var formData = new FormData();
  
      formData.append('passphrase', this.get('passphrase'));
      formData.append('certificate', this.get('certificate'));
  
      // Set processData and contentType to false so data is sent as FormData
      _.defaults(options || (options = {}), {
        url: this.url(),
        data: formData,
        type: 'PUT',
        processData: false,
        contentType: false,
        xhr: function(){
          // get the native XmlHttpRequest object
          var xhr = $.ajaxSettings.xhr();
          // set the onprogress event handler
          xhr.upload.onprogress = function(event) {
            // console.log('%d%', (event.loaded / event.total) * 100);
            // Trigger progress event on model for view updates
            model.trigger('progress', (event.loaded / event.total) * 100);
          };
          // set the onload event handler
          xhr.upload.onload = function(){
            model.trigger('progress', 100);
          };
          // return the customized object
          return xhr;
        }
      });
      return Backbone.sync.call(this, method, model, options).then(function(attributes){
        // update the apns provider details after saving
        model.push.update(attributes);
        return arguments;
      });
    }
  
  });
  
  mCAP.ApnsProvider = ApnsProvider;
  
  /*
  Usage
  var apnsProvider = new ApnsProvider({
    url: function () {
      return push.url()
    }
  });
  
  // <input id="file" type="file">
  // <input id="password" type="password">
  var apnsProviderFile = $('#file')[0].files[0];
  var apnsProviderPassword = this.$el.find('#password').val();
  
  apnsProvider.set('certificate', apnsProviderFile);
  apnsProvider.set('passphrase', apnsProviderPassword);
  
  apnsProvider.upload();
    */
  /**
   * The push app Model
   */
  var PushApp = mCAP.Component.extend({
  
    /**
     * The endpoint of the API
     * @type {String}
     */
    endpoint: 'push/api/' + mCAP.application.get('pushServiceApiVersion') + '/apps/',
  
    idAttribute: 'uuid',
  
    defaults: {
      uuid: null,
      name: '',
      apnsProvider: null,
      // example this.set('gcmProvider', {apiKey: ''});
      gcmProvider: null,
      version: -1,
      effectivePermissions: '*'
    },
  
    /**
     * Tags collection
     */
    tags: null,
  
    /**
     * Jobs collection
     */
    jobs: null,
  
    /**
     * Device collection
     */
    devices: null,
  
    initialize: function () {
      // cache
      var that = this;
      // API to the collections to get the url they are based on
      var _url = function () {
        return that.url();
      };
  
      /**
       * Interface to update the apnsProvider data after uploading a file
       * @param data
       * @returns {*}
       * @private
       */
      var _updateApnsProvider = function(data){
        return that.set('apnsProvider', data);
      };
  
      // give a url function to the constructor of the collections. The 'children' need the url to build their own one based on its 'parent'
      this.tags = new mCAP.Tags(null, {
        url: _url
      });
      this.jobs = new mCAP.Jobs(null, {
        url: _url
      });
      this.devices = new mCAP.Devices(null, {
        url: _url
      });
      this.apnsProvider = new mCAP.ApnsProvider(null, {
        url: _url,
        update: _updateApnsProvider
      });
  
      // call super
      return mCAP.Model.prototype.initialize.apply(this, arguments);
    },
  
    fetch: function () {
      return $.when(this.devices.fetch(), this.tags.fetch(), this.jobs.fetch(), mCAP.Model.prototype.fetch.apply(this, arguments));
    }
  
  });
  
  mCAP.PushApp = PushApp;
  /**
   * The push app collection
   */
  var PushApps = mCAP.Collection.extend({
  
    /**
     * The endpoint of the API
     * @type {String}
     */
    endpoint: 'push/api/' + mCAP.application.get('pushServiceApiVersion') + '/apps/',
  
    /**
     * The model
     * @type {mCAP.PushApp}
     */
    model: mCAP.PushApp,
  
    /**
     * Returns the data from the server
     * @param data
     * @returns {*}
     */
    parse: function(data){
      if(data && data.items){
        return data.items;
      }
      return data;
    }
  
  });
  
  mCAP.PushApps = PushApps;
  /**
   * Push namespace
   * @type {mCAP.PushApp}
   */
  mCAP.push = new mCAP.PushApp();
  /**
   * Wrapper for client app developer to use the push api
   * @param options
   * @constructor
   */
  mCAP.PushNotification = function (options) {
  
    options = options || {};
    var that = this;
    // default values for the push app
    var pushAppOptions = {};
    // use the pushServiceId as uuid of the pushApp
    if (options.pushServiceId) {
      pushAppOptions.uuid = options.pushServiceId;
    } else {
      console.info('no pushServiceId was given to the PushNotification. Please specify one to use the API');
    }
    // generate the push app to work on
    this.pushApp = new mCAP.PushApp(pushAppOptions);
  
    // the pushServiceId is only needed for the pushApp
    delete options.pushServiceId;
  
    this.senderId = typeof options.senderId !== 'undefined' ? options.senderId : this.senderId;
    delete options.senderId;
  
    // create the device based on the options
    this.device = this.pushApp.devices.add(options, {
      url: function () {
        return that.pushApp.url();
      }
    });
  
  };
  
  mCAP.PushNotification.prototype.trigger = Backbone.Model.prototype.trigger;
  mCAP.PushNotification.prototype.on = Backbone.Model.prototype.on;
  mCAP.PushNotification.prototype.off = Backbone.Model.prototype.off;
  
  /**
   * The senderid of the google server
   * @type {null}
   */
  mCAP.PushNotification.prototype.senderId = null;
  
  /**
   * The pushApp instance
   * @type {mCAP.PushApp}
   */
  mCAP.PushNotification.prototype.pushApp = null;
  
  /**
   * The instance of the device generated in the constructor
   * @type {null}
   */
  mCAP.PushNotification.prototype.device = null;
  
  
  /**
   * Update properties
   * @param key
   * @param value
   */
  mCAP.PushNotification.prototype.set = function (key, value) {
  
    if (key === 'pushServiceId') {
      this.pushApp.set('uuid', value);
    } else if (key === 'senderId') {
      this.senderId = value;
    } else {
      this.device.set(key, value);
    }
    return this;
  };
  
  /**
   * Get a property
   * @param key
   * @returns {*}
   */
  mCAP.PushNotification.prototype.get = function (key) {
    if (typeof this.device.get(key) !== 'undefined') {
      return this.device.get(key);
    } else if (typeof this.pushApp.get(key) !== 'undefined') {
      return this.pushApp.get(key);
    } else if (key === 'pushServiceId') {
      return this.pushApp.get('uuid');
    } else if (key === 'senderId') {
      return this.senderId;
    }
    return null;
  };
  
  /**
   * Return the configuration
   * @returns {*}
   */
  mCAP.PushNotification.prototype.getConfiguration = function () {
    return this.pushApp.toJSON();
  };
  
  /**
   * Add an extra attribute
   * @param key
   * @param value
   */
  mCAP.PushNotification.prototype.addAttribute = function (key, value) {
    this.device.attributes.attributes[key] = value;
    return this;
  };
  
  /**
   * Remove an extra attribute
   * @param key
   */
  mCAP.PushNotification.prototype.removeAttribute = function (key) {
    delete this.device.attributes.attributes[key];
    return this;
  };
  
  /**
   * Add extra attributes
   * @param object
   */
  mCAP.PushNotification.prototype.addAttributes = function (object) {
    this.device.attributes.attributes = _.extend(this.device.attributes.attributes, object);
    return this;
  };
  
  /**
   * Remove extra attributes
   * @param attributes
   */
  mCAP.PushNotification.prototype.removeAttributes = function (attributes) {
    if(typeof attributes === 'string'){
      // Converting the “arguments” object to an array
      attributes = Array.prototype.slice.call(arguments, 0);
    }
    // add the attributes.attributes in front of the array to be the first argument in _.omit
    attributes.unshift(this.device.attributes.attributes);
    this.device.attributes.attributes = _.omit.apply(_, attributes);
    return this;
  };
  
  /**
   * add an extra attribute
   * @param key
   * @param val
   */
  mCAP.PushNotification.prototype.putAttributeValue = function (key, val) {
    this.addAttribute(key, val);
    return this;
  };
  
  /**
   * Add a tag
   * @param tag
   * @returns {mCAP.PushNotification}
   */
  mCAP.PushNotification.prototype.addTag = function (tag) {
    this.addTags([tag]);
    return this;
  };
  
  /**
   * Remove a tag
   * @param tag
   */
  mCAP.PushNotification.prototype.removeTag = function (tag) {
    return this.removeTags([tag]);
  };
  
  /**
   * Add multiple tags
   * @param tags
   * @returns {mCAP.PushNotification}
   */
  mCAP.PushNotification.prototype.addTags = function (tags) {
    this.device.attributes.tags = _.union(this.device.attributes.tags, tags || []);
    return this;
  };
  
  /**
   * Remove tags
   * @param tags
   */
  mCAP.PushNotification.prototype.removeTags = function (tags) {
    this.device.attributes.tags = _.difference(this.device.attributes.tags, tags || []);
    return this;
  };
  
  /**
   * Subscribe to a tag
   * @param tag
   */
  mCAP.PushNotification.prototype.subscribeTag = function (tag) {
    this.addTag(tag);
    return this;
  };
  
  /**
   * Subscribe to multiple tags
   * @param tags
   */
  mCAP.PushNotification.prototype.subscribeTags = function (tags) {
    this.addTags(tags);
    return this;
  };
  
  /**
   * Set attributes
   */
  mCAP.PushNotification.prototype.setAttributes = function (key, val) {
    // TODO
    this.addAttribute(key, val);
    return this;
  };
  
  /**
   * Set the country
   * @param country
   */
  mCAP.PushNotification.prototype.setCountry = function (country) {
    this.set('country', country);
    return this;
  };
  
  /**
   * Set the badge
   * @param badge
   */
  mCAP.PushNotification.prototype.setCurrentBadge = function (badge) {
    this.set('badge', badge);
    return this;
  };
  
  /**
   * Set the token
   * @param token
   */
  mCAP.PushNotification.prototype.setToken = function (token) {
    this.set('token', token);
    return this;
  };
  
  /**
   * Set the language
   * @param language
   */
  mCAP.PushNotification.prototype.setLanguage = function (language) {
    this.set('language', language);
    return this;
  };
  
  /**
   * Set the device model
   * @parama model
   */
  mCAP.PushNotification.prototype.setModel = function (model) {
    this.set('model', model);
    return this;
  };
  
  /**
   * Set the name of the user
   * @param user
   */
  mCAP.PushNotification.prototype.setUser = function (user) {
    this.set('name', user);
    return this;
  };
  
  /**
   * unsubscribe from a tag
   * @param tag
   */
  mCAP.PushNotification.prototype.unsubscribeTag = function (tag) {
    this.removeTag(tag);
    return this;
  };
  
  /**
   * Remove the device from the mcap push list
   */
  mCAP.PushNotification.prototype.unregisterDevice = function () {
    if(this.device.isNew()){
      var dfd = new $.Deferred();
      dfd.reject('device was not saved before');
      return dfd.promise();
    }
    return this.device.destroy();
  };
  
  /**
   * Add the device to the mcap push list
   */
  mCAP.PushNotification.prototype.registerDevice = function () {
    return this.device.save();
  };
  
  /**
   * Change settings to the device
   */
  mCAP.PushNotification.prototype.save = function () {
    return this.device.save();
  };
  
  /**
   * Interface
   */
  mCAP.PushNotification.prototype.sendStatusBarNotification = function () {
    console.info('needs to be implemented by the specific implementation');
    return this;
  };
  
  /**
   * Interface
   */
  mCAP.PushNotification.prototype.showToastNotification = function () {
    console.info('needs to be implemented by the specific implementation');
    return this;
  };
  
  /**
   * Interface
   */
  mCAP.PushNotification.prototype.updateDeviceBadge = function () {
    console.info('needs to be implemented by the specific implementation');
    return this;
  };
  
  /**
   * Interface
   */
  mCAP.PushNotification.prototype.register = function () {
    console.info('needs to be implemented by the specific implementation');
    return this;
  };
  
  /**
   * Interface
   */
  mCAP.PushNotification.prototype.unregister = function () {
    console.info('needs to be implemented by the specific implementation');
    return this;
  };
  

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
  
  /**
   * Created by zarges on 19/10/15.
   */
  var FilterHolder = mCAP.Model.extend({
  
    endpoint: 'gofer/filter/rest/filterHolders',
  
    defaults: function () {
      return {
        aclEntries: [],
        filter: null,
        group: '',
        name: '',
        version: 0,
        filterValues: {},
        customUrlParams: {}
      };
    },
  
    _parseFilterToValuesAndUrlParams: function (filter, result) {
      result = result || {};
      if (filter.type === 'logOp') {
        filter.filters.forEach(function (filter) {
          this._parseFilterToValuesAndUrlParams(filter, result);
        }, this);
        return result;
      } else {
        if (filter.fieldName === '__filterValues__') {
          result.filterValues = JSON.parse(filter.value);
        }
        if (filter.fieldName === '__customUrlParams__') {
          result.customUrlParams = JSON.parse(filter.value);
        }
        return result;
      }
    },
  
    parse: function () {
      var parsed = mCAP.Model.prototype.parse.apply(this, arguments),
          data = parsed.data || parsed,
          result = this._parseFilterToValuesAndUrlParams(data.filter, {});
  
      if (result.filterValues) {
        data.filterValues = result.filterValues;
      }
      if (result.customUrlParams) {
        data.customUrlParams = result.customUrlParams;
      }
  
      return data;
    },
  
    beforeSave: function (attrs) {
      var currentUserUuid = mCAP.authenticatedUser.get('uuid');
      if (currentUserUuid) {
        attrs.aclEntries.push(currentUserUuid + ':rw');
      }
      attrs.version += 1;
  
      var filters = [];
      if (_.size(attrs.filterValues) > 0) {
        var filterValuesFilter = (new mCAP.Filter()).string('__filterValues__', JSON.stringify(attrs.filterValues));
        filters.push(filterValuesFilter);
      }
      if (_.size(attrs.customUrlParams) > 0) {
        var customUrlParamsFilter = (new mCAP.Filter()).string('__customUrlParams__', JSON.stringify(attrs.customUrlParams));
        filters.push(customUrlParamsFilter);
      }
      if (filters.length > 0) {
        attrs.filter = (new mCAP.Filter()).or(filters);
      }
  
      delete attrs.totalAmount;
      delete attrs.filterValues;
      delete attrs.customUrlParams;
      return attrs;
    },
  
    isValid: function () {
      var name = this.get('name'),
        filterValues = this.get('filterValues'),
        urlParams = this.get('customUrlParams');
  
      return (name && name.length > 0 && ( (filterValues && _.size(filterValues) > 0) || (urlParams && _.size(urlParams) > 0) ) );
    }
  
  });
  
  mCAP.FilterHolder = FilterHolder;
  /**
   * Created by zarges on 19/10/15.
   */
  var FilterHolders = mCAP.Collection.extend({
  
    endpoint: 'gofer/filter/rest/filterHolders',
  
    model: mCAP.FilterHolder,
  
    filterableOptions: function () {
      return {
        sortOrder: '+name',
        filterValues: {
          type: ''
        },
        customUrlParams: {
          getNonpagedCount: true
        },
        filterDefinition: function () {
          var filter = new mCAP.Filter();
          return filter.string('group', this.filterValues.type);
        }
      };
    },
  
    parse: function (rsp) {
      return rsp.data.items;
    },
  
    getType: function(){
      return this._type;
    },
  
    constructor: function (models, opts) {
      var constructor = mCAP.Collection.prototype.constructor.apply(this, arguments);
      if (_.isString(opts)) {
        this.filterable.setFilters({type: opts});
        this._type = opts;
        this.on('add', function(model){
          model.set({'group': opts});
        });
      }
      return constructor;
    }
  
  });
  
  mCAP.FilterHolders = FilterHolders;


  root.mCAP = mCAP;

}(this, Backbone, $, _));
