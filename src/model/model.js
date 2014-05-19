var SelectableFactory = SelectableFactory || {};

var Model = Backbone.Model.extend({

  idAttribute: 'uuid',
  // default the model is selectable - set to false to turn selectable off
  selectable: true,
  selectableOptions: null,
  constructor: function () {
    // When a model gets removed, make sure to decrement the total count on the collection
    this.on('destroy', function () {
      if (this.collection && this.collection.filterable && this.collection.filterable.getTotalAmount() > 0) {
        this.collection.filterable.setTotalAmount(this.collection.filterable.getTotalAmount() - 1);
      }
    }, this);

    if (this.selectable) {
      var options = this.selectableOptions || {};
      this.selectable = new SelectableFactory(this, options);
    }

    if (typeof this.endpoint === 'string') {
      this.setEndpoint(this.endpoint);
    }

    return Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  setEndpoint: function (endpoint) {
    this.urlRoot = function () {
      if (mCap.application.get('baseUrl').slice(-1) === '/' && endpoint[0] === '/') {
        return mCap.application.get('baseUrl') + endpoint.substr(1);
      } else if (mCap.application.get('baseUrl').slice(-1) !== '/' && endpoint[0] !== '/') {
        return mCap.application.get('baseUrl') + '/' + endpoint;
      }
      return mCap.application.get('baseUrl') + endpoint;
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

  initialize: function(){
    _.bindAll(this, "_markToRevert", "revert");
    this._markToRevert();
  },

  revert: function() {
    if( this._revertAttributes ) {
      this.set(this._revertAttributes, {
        silent: true
      });
    }
  },

  /**
   * Store attributes to enable a revert - useful for cancel for example
   */
  _markToRevert: function() {
    this._revertAttributes = _.clone(this.parse(this.toJSON()));
  },

  /**
   * Check if the model is still in sync with the last saved state.
   * @returns {Boolean|boolean}
   */
  isInSync: function() {
    return _.isEqual(this._revertAttributes, this.attributes);
  },

  /**
   * Save the model to the server
   * @param key
   * @param val
   * @param options
   * @returns {*}
   */
  save: function( key, val, options ) {
    var args = this._save(key, val, options);
    return Backbone.Model.prototype.save.apply(this, args);
  },

  /**
   * Handle stuff for a save
   * @param key
   * @param val
   * @param options
   * @returns {Array}
   * @private
   */
  _save: function( key, val, options ) {
    // prepare options
    if( key == null || typeof key === 'object' ) {
      options = val;
    }
    // make sure options are defined
    options = _.extend({validate: true}, options);
    // cache success
    var success = options.success;
    // cache model
    var model = this;

    // overwrite success
    options.success = function( resp ) {
      model._markToRevert();
      // call cached success
      if( success ) {
        success(model, resp, options);
      }
    };

    // make sure options are the correct paramater
    if( key == null || typeof key === 'object' ) {
      val = options;
    }

    return [key, val, options];
  }

});

mCap.Model = Model;