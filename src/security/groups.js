var Groups = mCAP.Collection.extend({

  endpoint: 'gofer/security/rest/groups',

  model: mCAP.Group,

  parse: function (resp) {
    return resp.data.items;
  },

  filterableOptions: function () {
    return {
      sortOrder: '+name',
      filterValues: {
        name: '',
        systemPermission: false
      },
      filterDefinition: function () {
        var filter = new mCAP.Filter();

        var filters = [
          filter.containsString('name', this.filterValues.name)
        ];

        if (this.filterValues.systemPermission !== true) {
          filters.push(filter.boolean('systemPermission', this.filterValues.systemPermission));
        }
        return filter.and(filters);
      }
    };
  }

});

var UserGroups = Groups.extend({

  constructor: function(args){
    this.endpoint='gofer/security/rest/users/'+args.userId+'/groups';
    Groups.prototype.constructor.apply(this,arguments);
  },

  parse:function(resp){
    return resp.data.groups;
  },

  create:function(){
    throw new Error('This method is not supported. Add all models to this collection by calling the add method and call the method save afterwards');
  },

  save:function(){
    var groups = _.pluck(this.models, 'id');

    Backbone.ajax({
      url:this.endpoint,
      data: groups,
      type: 'PUT',
      success:function(){}
    });
  }

});

mCAP.Groups = Groups;
mCAP.UserGroups = UserGroups;
