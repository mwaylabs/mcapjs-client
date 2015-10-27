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