var Filterable = Filterable || {},
  SelectableFactory = SelectableFactory || {};

var Collection = Backbone.Collection.extend({

  selectable: true,
  filterable: true,
  filterableOptions: function () {
    return {};
  },
  selectableOptions: function () {
    return {};
  },

  model: mCAP.Model,

  constructor: function () {
    var superConstructor = Backbone.Collection.prototype.constructor.apply(this, arguments);
    if (this.selectable) {
      this.selectable = new SelectableFactory(this, _.result(this, 'selectableOptions'));
    }

    if (this.filterable) {
      this.filterable = new Filterable(this, _.result(this, 'filterableOptions'));
    }

    if (this.endpoint) {
      this.setEndpoint(this.endpoint);
    }

    return superConstructor;
  },

  setEndpoint: function (endpoint) {
    this.url = function () {
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

  replace: function (models) {
    this.reset(models);
    this.trigger('replace', this);
  },

  secureEach: function (callback, ctx) {
    // This method can be used when items are removed from the collection during the each loop
    // When doing this in the normal each method you will get referencing issues—in java terms you
    // would get a ConcurrentModificationException
    _.pluck(this.models, 'cid').forEach(function (cid, index) {
      var model = this.get(cid, index);
      callback.call(ctx, model, index, this.models);
    }.bind(this));
  }

});

mCAP.Collection = Collection;

