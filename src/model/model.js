var SelectableFactory = SelectableFactory || {};

var Model = Backbone.Model.extend({

  idAttribute: 'uuid',
  // default the model is selectable - set to false to turn selectable off
  selectable: true,
  selectableOptions: {},
  constructor: function () {
    // When a model gets removed, make sure to decrement the total count on the collection
    this.on('destroy', function () {
      if (this.collection && this.collection.filterable && this.collection.filterable.getTotalAmount() > 0) {
        this.collection.filterable.setTotalAmount(this.collection.filterable.getTotalAmount() - 1);
      }
    }, this);

    if (this.selectable) {
      this.selectable = new SelectableFactory(this, this.selectableOptions);
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
    if (response && response.data && response.data.results  && response.data.results.length >= 0) {
      return response.data.results[0];
      // If Model is embedded in collection, it's already parsed correctly
    } else {
      return response;
    }
  }

});

mCap.Model = Model;