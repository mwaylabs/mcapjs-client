/**
 * Created by zarges on 19/10/15.
 */
var FilterHolder = mCAP.Model.extend({

  endpoint: 'gofer/filter/rest/filterHolders',

  defaults: function(){
    return {
      aclEntries: [],
      filter: null,
      group: '',
      name: '',
      version: 0,
      filterValues:{}
    };
  },

  parse: function(){
    var parsed = mCAP.Model.prototype.parse.apply(this,arguments),
        data = parsed.data || parsed,
        split = data.name.split('#VAL');

    data.name = split[0];
    if(split[1]){
      data.filterValues = JSON.parse(split[1]);
    }

    return data;
  },

  beforeSave: function(attrs){
    var currentUserUuid = mCAP.authenticatedUser.get('uuid');
    if(currentUserUuid){
      attrs.aclEntries.push(currentUserUuid+':rw');
    }
    attrs.version += 1;
    if(_.size(attrs.filterValues)>0){
      attrs.name = attrs.name+'#VAL'+JSON.stringify(attrs.filterValues);
    }
    delete attrs.totalAmount;

    delete attrs.filterValues;
    return attrs;
  },

  isValid: function(){
    var name = this.get('name'),
        filterValues = this.get('filterValues');

    return (name && name.length>0 && filterValues && _.size(filterValues)>0);
  }

});

mCAP.FilterHolder = FilterHolder;