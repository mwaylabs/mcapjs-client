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
      url: settings.url,
      dataType: settings.dataType || '',
      data: settings.data || {t: new Date().getTime()}
    };
  
    if (settings.method) {
      ajaxOptions.method = settings.method;
    }
  
    if (settings.contentType) {
      ajaxOptions.contentType = settings.contentType;
    }
  
    if (settings.timeout) {
      ajaxOptions.timeout = settings.timeout;
    }
  
    return $.ajax(ajaxOptions);
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
        _filterDefinition = options.filterDefinition,
        _sortOrder = options.sortOrder,
        _totalAmount;
  
    this.filterValues = options.filterValues;
    this.customUrlParams = options.customUrlParams;
  
    this.getRequestParams = function (method, model, options) {
      options.params = options.params || {};
  
      if (method === 'read') {
        // Filter functionality
        var filter = this.getFilters();
        if (filter) {
          options.params.filter = filter;
        }
  
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
  
        // Custom URL parameters
        if (this.customUrlParams) {
          _.extend(options.params, this.customUrlParams);
        }
  
        return options;
      }
    };
  
    this.setTotalAmount = function (totalAmount) {
      _totalAmount = totalAmount;
    };
  
    this.getTotalAmount = function () {
      return _totalAmount;
    };
  
    this.loadPreviousPage = function () {
      _page -= 1;
      _collection.fetch({remove: false});
    };
  
    this.hasPreviousPage = function () {
      return _page >= 1;
    };
  
    this.loadNextPage = function () {
      _page += 1;
      _collection.fetch({remove: false});
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
      // TODO: persist sortOrder here
      // ....
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
    };
  
    this.getFilters = function () {
      if (_.isFunction(_filterDefinition)) {
        return _filterDefinition.apply(this);
      }
    };
  
    this.resetFilters = function () {
      this.filterValues = _initialFilterValues ? JSON.parse(JSON.stringify(_initialFilterValues)) : _initialFilterValues;
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
      _selected = options.selected || [],
      _radio = options.radio === true;
  
    this.getSelectedModels = function () {
      var selected = [];
      _collection.models.forEach(function (model) {
        if (model.selectable && model.selectable.isSelected()) {
          selected.push(model);
        }
      });
      return selected;
    };
  
    this.getDisabledModels = function () {
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
  
    this.selectModels = function (models) {
      models.forEach(function (model) {
        var modelToSelect = _collection.findWhere({uuid: model.id});
        if (modelToSelect && modelToSelect.selectable) {
          modelToSelect.selectable.select();
        }
  
      });
    };
  
    this.reset = function () {
      this.unSelectAllModels();
      this.selectModels(_selected);
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
  
    (function _main(self) {
      collectionInstance.on('add', function () {
        self.selectModels(_selected);
      });
      if (!_collection instanceof Backbone.Collection) {
        throw new Error('First parameter has to be the instance of a collection');
      }
    }(this));
  
  };
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
  /*jshint unused:false */
  var ModelSelectable = ModelSelectable || {},
      CollectionSelectable = CollectionSelectable || {};
  
  var SelectableFactory = function (instance, options) {
    if (instance instanceof Backbone.Model) {
      return new ModelSelectable(instance, options);
    } else if (instance instanceof Backbone.Collection) {
      return new CollectionSelectable(instance, options);
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
    constructor: function () {
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
  
      // apply scope to _markToRevert
      _.bindAll(this, '_markToRevert', 'revert');
      // send the attributes or empty object
      this._markToRevert(arguments[0] || {});
  
      return Backbone.Model.prototype.constructor.apply(this, arguments);
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
        // If Model is embedded in collection, it's already parsed correctly
      } else {
        return response;
      }
    },
  
    url: function () {
      var url = Backbone.Model.prototype.url.apply(this, arguments);
      if (this.queryParameter) {
        url += '?' + Backbone.$.param(this.queryParameter);
      }
      return url;
    },
  
    /**
     * Initialize the Backbone extended object
     * @returns {*}
     */
    initialize: function () {
      // DO NOT IMPLEMENT CODE HERE! THE USER SHOULDN'T CALL SUPER IN HIS OWN IMPL.
      return Backbone.Model.prototype.initialize.apply(this, arguments);
    },
  
    /**
     * Reverts a model to the latest saved state
     * @example
     * var model = new mCAP.Model({
     *  name: 'Max'
     * });
     * model.set('name', 'Maximilian');
     * console.log(model.get('name')); // Maximilian
     * model.revert();
     * console.log(model.get('name')); // Max
     */
    revert: function () {
      if (this._revertAttributes) {
        this.attributes = JSON.parse(JSON.stringify(this._revertAttributes));
      }
    },
  
    /**
     * Store attributes to enable a revert - useful for cancel for example
     */
    _markToRevert: function (data) {
      this._revertAttributes = JSON.parse(JSON.stringify(data || this.attributes));
    },
  
    /**
     * Check if the model is still in sync with the last saved state.
     * @returns {Boolean|boolean}
     */
    isInSync: function () {
      return _.isEqual(this._revertAttributes, this.attributes);
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
  
    save: function (key, val, options) {
      var args = this._save(key, val, options);
      var orgAttributes = this.attributes;
      this.attributes = this.beforeSave(_.clone(orgAttributes));
      var save = Backbone.Model.prototype.save.apply(this, args).then(function (model) {
        model.attributes = orgAttributes;
        return model;
      });
      return save;
    },
  
    /**
     * Handle stuff for a save
     * @param key
     * @param val
     * @param options
     * @returns {Array}
     * @private
     */
    _save: function (key, val, options) {
      // prepare options
      // needs to be == not === because backbone has the same check. If key is undefined the check will fail with === but jshint does not allow == so this is the workaround to   key == null || typeof key === 'object'
      if (typeof key === 'undefined' || key === void 0 || key === null || typeof key === 'object') {
        options = val;
      }
      // make sure options are defined
      options = _.extend({validate: true}, options);
      // cache success
      var success = options.success;
      // cache model
      var model = this;
  
      // overwrite success
      options.success = function (resp) {
        model._markToRevert();
        // call cached success
        if (success) {
          success(model, resp, options);
        }
      };
  
      // make sure options are the correct paramater
      // needs to be == not === because backbone has the same check. If key is undefined the check will fail with === but jshint does not allow == so this is the workaround to   key == null || typeof key === 'object'
      if (typeof key === 'undefined' || key === void 0 || key === null || typeof key === 'object') {
        val = options;
      }
  
      return [key, val, options];
    },
  
    /**
     * Fetch the model to the server
     * @param options
     * @returns {*}
     */
    fetch: function (options) {
      // implement own fetch callback
      var args = this._fetch(options);
      return Backbone.Model.prototype.fetch.apply(this, args);
    },
  
    /**
     * Adds markToRevert to successful fetch
     * @param options
     * @returns {*[]}
     * @private
     */
    _fetch: function (options) {
      options = options || {};
      // cache success
      var success = options.success;
      // cache model
      var model = this;
  
      // overwrite success
      options.success = function (resp) {
        model._markToRevert();
        // call cached success
        if (typeof success === 'function') {
          success(model, resp, options);
        }
      };
      return [options];
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
      if(arguments[2]){
        mCAP.Utils.setAuthenticationEvent(arguments[2]);
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
    _save: function (key, val, options) {
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
      return mCAP.Model.prototype._save.call(this, key, val, options);
    }
  
  });
  
  mCAP.Component = Component;
  var Filterable = Filterable || {},
    SelectableFactory = SelectableFactory || {};
  
  var Collection = Backbone.Collection.extend({
  
    selectable: true,
    filterable: true,
    filterableOptions: {},
    selectableOptions: {},
  
    model: mCAP.Model,
  
    constructor: function () {
      if (this.selectable) {
        this.selectable = new SelectableFactory(this,  _.result(this,'selectableOptions'));
      }
  
      if (this.filterable) {
        this.filterable = new Filterable(this, _.result(this,'filterableOptions'));
      }
  
      if (this.endpoint) {
        this.setEndpoint(this.endpoint);
      }
  
      return Backbone.Collection.prototype.constructor.apply(this, arguments);
    },
  
    setEndpoint: function (endpoint) {
      this.url = function(){
        return URI(mCAP.application.get('baseUrl') + '/' + endpoint).normalize().toString();
      };
    },
  
    parse: function (response) {
      response.data = response.data || {};
      if (this.filterable) {
        this.filterable.setTotalAmount(response.data.total || 0);
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
    }
  
  });
  
  mCAP.Collection = Collection;
  
  
  var Filter = function () {
    // If it is an invalid value return null otherwise the provided object
    var returnNullOrObjectFor = function (value, object) {
      return (_.isUndefined(value) || value === null || value === '') ? null : object;
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
  
      like: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'like',
          fieldName: fieldName,
          like: value
        });
      }
    };
  
  };
  
  mCAP.Filter = Filter;
  var Application = mCAP.Model.extend({
  
    defaults: {
      'baseUrl': '',
      'pushServiceApiVersion': 'v1'
    }
  
  });
  
  mCAP.application = new Application();
  /**
   * mCAP Authentication
   */
  var Authentication = mCAP.Model.extend({
  
    defaults: {
      'userName': '',
      'orgaName': '',
      'password': '',
      'email': '',
      'organization': null,
      'user': null
    },
  
    endpoint: 'gofer/security/rest/auth/',
  
    /**
     * Perform a login request against the server configured with mCAP.application.set('baseUrl', 'https://server.com');
     * Fires a login event everytime a login is performed. Even if the login was not successful.
     * @param options - Can either be a string for the password or an object with credentials.
     * @returns promise
     * @example
     *
     * // login with password
     * mCAP.authentication.login('pass').then(function(){};
     * // login with credentials
     * mCAP.authentication.login({
        userName: 'm.mustermann',
        orgaName: 'org',
        password: 'pass'
      });
     * // event when auth was successful
     * mCAP.authentication.on('login', function(){})
     * // event when auth was not successful
     * mCAP.authentication.on('authenticationerror', function(obj, err, errMsg){})
     */
    login: function (options) {
      var that = this;
      if (typeof options === 'string') {
        this.set('password', options);
      } else if (typeof options === 'object') {
        this.set(options);
      }
      return this.save(null, {
        url: this.url() + 'login'
      }).then(function(){
        // trigger login on successful login
        that._triggerEvent('login', arguments);
        return arguments[0];
      }).fail(function(){
        // trigger loginerror on authentication error
        that._triggerEvent('authenticationerror', arguments);
        return arguments;
      }).always(function () {
        if (typeof options === 'string') {
          that.set('password', '');
        }
        return arguments;
      });
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
      var that = this;
      return this.save(null, {
        url: this.url() + 'logout'
      }).always(function () {
        that._triggerEvent('logout', arguments);
      });
    },
  
    /**
     * Takes the arguments from the server and builds objects needed on the client side
     * @private
     * @param data
     * @returns {{}}
     */
    parse: function (data) {
      var attributes = {};
      if (data) {
        if (data.user) {
          // build a user
          attributes.user = new mCAP.User(data.user);
        }
        if (data.organization) {
          // build a organization
          attributes.organization = new mCAP.Organization(data.organization);
        }
      }
      return attributes;
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
      var dfd = $.Deferred();
      var uuid = null;
      // check if there was a login before
      if(mCAP.authentication.get('user') && mCAP.authentication.get('user').get('uuid')){
        uuid = mCAP.authentication.get('user').get('uuid');
      } else {
        dfd.reject('no user set');
        return dfd.promise();
      }
  
      mCAP.Utils.request({
        url: URI(mCAP.application.get('baseUrl') + '/gofer/system/security/currentAuthorization').normalize().toString()
      }).then(function (data) {
        // resolve only if the current user is authenticated
        if (data.user && data.user.uuid && data.user.uuid === uuid) {
          dfd.resolve(data);
        }
        // otherwise reject
        dfd.reject('not authenticated', data);
        return;
      }).fail(function (err) {
        dfd.reject(err);
      });
      return dfd.promise();
    }
  
  });
  
  // API
  mCAP.authentication = new Authentication();
  var User = mCAP.Model.extend({
  
    endpoint: 'gofer/security/rest/users',
  
    defaults: {
      'uuid': null,
      'name': '',
      'salutation': null,
      'givenName': '',
      'surname': '',
      'position': null,
      'email': '',
      'phone': null,
      'country': null,
      'lastLoggedTime': 0,
      'passwordExpires': null,
      'locked': false,
      'activated': true,
      'version': 0,
      'aclEntries': [],
      'preferences': {},
      'groups': null,
      'roles': []
    },
  
    parse: function (resp) {
      var data = resp.data || resp;
      if(this.attributes && !this.attributes.groups){
        data.groups = new mCAP.UserGroups({userId: this.id});
      }
      return resp.data || resp;
    },
  
    validate: function(){
      this.attributes.version++;
    },
  
    beforeSave: function(attributes){
      delete attributes.groups;
      delete attributes.roles;
      if(attributes.password==='' || attributes.password===null){
        delete attributes.password;
      }
      return attributes;
    },
  
    save: function(){
      return mCAP.Model.prototype.save.apply(this,arguments);
    }
  
  });
  
  mCAP.User = User;
  
  var Users = mCAP.Collection.extend({
  
    endpoint: 'gofer/security/rest/users',
  
    model: mCAP.User,
  
    parse: function(resp){
      return resp.data.items;
    },
  
  
  
    filterableOptions: function(){
      return {
        sortOrder:'+name',
        filterValues: {
          name: ''
        },
        filterDefinition: function () {
          var filter = new mCAP.Filter();
          return filter.and([
            filter.containsString('name', this.filterValues.name)
          ]);
        }
      };
    }
  
  });
  
  mCAP.Users = Users;
  var Organization = mCAP.Model.extend({
  
    endpoint: 'gofer/security/rest/organizations',
  
    defaults: {
      'uuid': null,
      'aclEntries': null,
      'name': null,
      'uniqueName': null,
      'address': null,
      'billingSettings': null,
      'technicalPerson': null,
      'assetPath': null,
      'reportLocaleString': null,
      'defaultRoles': null,
      'version': null,
      'effectivePermissions': null
    }
  
  });
  
  mCAP.Organization = Organization;
  
  var Organizations = mCAP.Collection.extend({
  
    endpoint: 'gofer/security/rest/organizations',
  
    model: mCAP.Organization,
  
    parse: function (resp) {
      return resp.data.items;
    }
  
  });
  
  mCAP.Organizations = Organizations;
  var Role = mCAP.Model.extend({
  
    endpoint: 'gofer/form/rest/enumerables/paginatedPairs/roles',
  
    defaults: {
      uuid: null,
      name: ''
    }
  
  });
  
  mCAP.Role = Role;
  
  var Roles = mCAP.Collection.extend({
  
    endpoint: 'gofer/form/rest/enumerables/paginatedPairs/roles',
  
    model: mCAP.Role,
  
    parse: function (resp) {
      var items = resp.data.items,
        roles = [];
      items.forEach(function (item) {
        roles.push({
          uuid: item.value,
          name: item.label
        });
      });
      return roles;
    }
  });
  
  mCAP.Roles = Roles;
  
  var Member = mCAP.Model.extend({
  
    endpoint: 'gofer/form/rest/enumerables/paginatedPairs/members',
  
    defaults: {
      uuid: null,
      name: ''
    }
  
  });
  
  mCAP.Member = Member;
  
  var Members = mCAP.Collection.extend({
  
    endpoint: 'gofer/form/rest/enumerables/paginatedPairs/members',
  
    model: mCAP.Member,
  
    parse: function (resp) {
      var items = resp.data.items,
        roles = [];
      items.forEach(function (item) {
        roles.push({
          uuid: item.value,
          name: item.label
        });
      });
      return roles;
    }
  
  });
  
  mCAP.Members = Members;
  
  var Group = mCAP.Model.extend({
  
    endpoint: 'gofer/security/rest/groups',
  
    defaults: function(){
      return {
        uuid: null,
        name: '',
        version: 0,
        organizationUuid: '',
        description: null,
        roles: new mCAP.Roles(),
        members: new mCAP.Members(),
        aclEntries: [],
        effectivePermissions: '',
        sysRoles: [],
        systemPermission: false,
        bundle: null
      };
    },
  
    validate: function(attributes){
      if(!attributes.organizationUuid || attributes.organizationUuid.length<1){
        return 'Missing organization uuid';
      }
      this.attributes.version++;
    },
  
    beforeSave: function(data){
      var roles = [],
          members = [];
  
      if(data.members){
        data.members.each(function(memberModel){
          members.push(memberModel.id);
        });
      }
  
      if(data.roles){
        data.roles.each(function(roleModel){
          roles.push(roleModel.id);
        });
      }
  
      data.roles = roles;
      data.members = members;
      return data;
    },
  
    parse: function (resp) {
      var data = resp.data || resp,
        roles = new mCAP.Roles(null,{groupId: data.uuid}),
        members = new mCAP.Members(null,{groupId: data.uuid});
  
      if(data.roles){
        data.roles.forEach(function (role) {
          roles.add({uuid: role});
        });
      }
  
      if(data.members){
        data.members.forEach(function (member) {
          members.add({uuid: member});
        });
      }
  
      data.roles = roles;
      data.members = members;
  
      return data;
    }
  
  });
  
  mCAP.Group = Group;
  
  var Groups = mCAP.Collection.extend({
  
    endpoint: 'gofer/security/rest/groups',
  
    model: mCAP.Group,
  
    parse: function (resp) {
      return resp.data.items;
    },
  
    filterableOptions: function () {
      return {
        sortOrder: '+name',
        filterValues: {
          name: '',
          systemPermission: false
        },
        filterDefinition: function () {
          var filter = new mCAP.Filter();
  
          var filters = [
            filter.containsString('name', this.filterValues.name)
          ];
  
          if (this.filterValues.systemPermission !== true) {
            filters.push(filter.boolean('systemPermission', this.filterValues.systemPermission));
          }
          return filter.and(filters);
        }
      };
    }
  
  });
  
  var UserGroups = Groups.extend({
  
    constructor: function(args){
      this.endpoint='gofer/security/rest/users/'+args.userId+'/groups';
      Groups.prototype.constructor.apply(this,arguments);
    },
  
    parse:function(resp){
      return resp.data.groups;
    },
  
    create:function(){
      throw new Error('This method is not supported. Add all models to this collection by calling the add method and call the method save afterwards');
    },
  
    save:function(){
      var groups = _.pluck(this.models, 'id');
  
      Backbone.ajax({
        url:this.endpoint,
        data: groups,
        type: 'PUT',
        success:function(){}
      });
    }
  
  });
  
  mCAP.Groups = Groups;
  mCAP.UserGroups = UserGroups;
  

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
  

  root.mCAP = mCAP;

}(this, Backbone, $, _));
