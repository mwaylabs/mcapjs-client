var Filterable = Filterable || {},
  SelectableFactory = SelectableFactory || {};

var EnumerableCollection = mCAP.Collection.extend({

  selectable: false,
  filterable: false,
  parse: function (resp) {
    var appTypes = [];
    _.each(resp.data, function (type) {
      appTypes.push({key: type.value});
    });
    return appTypes;
  },
  toJSON: function () {
    return this.pluck('key');
  }

});

mCAP.EnumerableCollection = EnumerableCollection;

