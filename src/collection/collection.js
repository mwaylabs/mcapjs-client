var Filterable = Filterable || {},
  SelectableFactory = SelectableFactory || {};

var Collection = Backbone.Collection.extend({

  selectable: true,
  filterable: true,
  filterableOptions: {},
  selectableOptions: {},

  model: mCap.Model,

  constructor: function () {
    if (this.selectable) {
      this.selectable = new SelectableFactory(this, this.selectableOptions);
    }

    if (this.filterable) {
      this.filterable = new Filterable(this, this.filterableOptions);
    }

    if (this.endpoint) {
      this.setEndpoint(this.endpoint);
    }

    return Backbone.Collection.prototype.constructor.apply(this, arguments);
  },

  setEndpoint: function (endpoint) {
    this.url = mCap.application.get('baseUrl') + '/' + endpoint;
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

mCap.Collection = Collection;

