(function (root, Backbone, $, _) {
  'use strict';

  var sync = Backbone.sync,
    mCAP = {};

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
  /**
   * Utils namespace
   * @type {Object}
   */
  mCAP.Utils = {};
  
  // global mcap constants
  mCAP.MCAP = 'MCAP';
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
        this.selectable = new SelectableFactory(this,  _.result(this,'selectableOptions'));
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
  
    setQueryParameter: function(attr,value){
      this.queryParameter = this.queryParameter || {};
      if(typeof attr === 'string'){
        this.queryParameter[attr]=value;
      }
    },
  
    removeQueryParameter: function(attr){
      if(this.queryParameter && attr && this.queryParameter[attr]){
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
  
    url: function(){
      var url = Backbone.Model.prototype.url.apply(this,arguments);
      if(this.queryParameter){
        url+='?'+Backbone.$.param(this.queryParameter);
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
  
    beforeSave: function(attributes){
      return attributes;
    },
  
    save: function (key, val, options) {
      var args = this._save(key, val, options);
      var orgAttributes = this.attributes;
      this.attributes = this.beforeSave(_.clone(orgAttributes));
      var save = Backbone.Model.prototype.save.apply(this, args).then(function(model){
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
      if (key === null || typeof key === 'object') {
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
      if (key === null || typeof key === 'object') {
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
  
    _triggerEvent: function(eventName, args){
      // cast arguments to array
      var _args = Array.prototype.slice.call(args, 0);
      // add the event name
      _args.unshift(eventName);
      // trigger the event
      this.trigger.apply(this, _args);
    }
  
  });
  
  mCAP.Model = Model;
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
        return mCAP.application.get('baseUrl') + '/' + endpoint;
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
    initialize: function (push) {
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
      'providerType': mCAP.MCAP,
      'user': '',
      'vendor': '',
      'name': '',
      'osVersion': '',
      'language': 'de',
      'country': 'DE',
      'tags': null,
      'badge': 0,
      'token': ''
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
   * The push app Model
   */
  var PushApp = mCAP.Model.extend({
  
    /**
     * The endpoint of the API
     * @type {String}
     */
    endpoint: '/push/api/' + mCAP.application.get('pushServiceApiVersion') + '/apps/',
  
    idAttribute: 'uuid',
  
    defaults: {
      uuid: '',
      name: '',
      apnsProvider: null,
      gcmProvider: null,
      version: 0,
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
      var _url = function(){
        return that.url();
      };
  
      // give a url function to the constructor of the collections. The 'children' need the url to build their own one based on its 'parent'
      this.tags = new mCAP.Tags({
        url: _url
      });
      this.jobs = new mCAP.Jobs({
        url: _url
      });
      this.devices = new mCAP.Devices({
        url: _url
      });
  
      // call super
      return mCAP.Model.prototype.initialize.apply(this, arguments);
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
  mCAP.push = new mCAP.PushApp({});

  root.mCAP = mCAP;

}(this, Backbone, $, _));
