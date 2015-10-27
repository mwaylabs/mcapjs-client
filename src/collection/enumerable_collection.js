var Filterable = Filterable || {},
  SelectableFactory = SelectableFactory || {};

var EnumerableCollection = mCAP.Collection.extend({

  selectable: false,
  filterable: false,
  defaults: function(){
    return [];
  },
  parse: function (resp) {
    var enums = [];
    _.each(resp.data, function (type) {
      enums.push({key: type.value});
    });
    return enums;
  },
  toJSON: function () {
    return this.pluck('key');
  },
  model: mCAP.Model.extend({
    idAttribute:'key'
  }),
  constructor: function(){
    var superConstructor = mCAP.Collection.prototype.constructor.apply(this,arguments),
        defaults = _.result(this, 'defaults');

    if(defaults.length>0){
      _.each(defaults,function(key){
        this.add({
          key: key
        });
      },this);
    }
    return superConstructor;
  }

});

mCAP.EnumerableCollection = EnumerableCollection;

