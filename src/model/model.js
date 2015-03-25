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
    var attrs = attributes || {},
      nested = {};

    options = options || {};
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) {
      this.collection = options.collection;
    }
    nested = this.prepare();
    this.set(nested);
    if (options.parse) {
      attrs = this.parse(attrs, options) || {};
    }
    attrs = _.defaults({}, attrs, nested, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
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
      // If Model is embedded in collection, it's already parsed correctly
    } else {
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