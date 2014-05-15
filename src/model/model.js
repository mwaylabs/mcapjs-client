var SelectableFactory = SelectableFactory || {};

var Model = Backbone.Model.extend({

  idAttribute: 'uuid',
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

    if (this.endpoint) {
      this.setEndpoint(this.endpoint);
    }

    return Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  setEndpoint: function (endpoint) {
    this.urlRoot = mCap.application.get('baseUrl') + '/' + endpoint;
  },

  parse: function (response) {
    // For standalone models, parse the response
    if (response.data && response.data.results) {
      return response.data.results[0];
      // If Model is embedded in collection, it's already parsed correctly
    } else {
      return response;
    }
  }

});

mCap.Model = Model;