var Groups = mCAP.Collection.extend({

  endpoint: 'gofer/security/rest/groups',

  model: mCAP.Group,

  parse: function (resp) {
    this.filterable.setTotalAmount(resp.data.nonpagedCount);
    return resp.data.items;
  },

  filterableOptions: function () {
    return {
      sortOrder: '+name',
      filterValues: {
        name: '',
        uuid: '',
        groupType: '',
        members: [],
        strictSearch: false,
        organizationUuid: ''
      },
      customUrlParams:{
        getNonpagedCount:true
      },
      fields:['uuid','name','description','readonly','groupType'],
      filterDefinition: function () {
        var filter = new mCAP.Filter();

        var filters = [];

        if(this.filterValues.strictSearch){
          filters.push(filter.string('name', this.filterValues.name));
        } else {
          filters.push(filter.containsString('name', this.filterValues.name));
        }

        if (this.filterValues.groupType === '') {
          filters.push(filter.stringEnum('groupType', ['GROUP','SYSTEM_GROUP']));
        } else {
          filters.push(filter.stringEnum('groupType', this.filterValues.groupType));
        }

        filters.push(filter.string('members',this.filterValues.members));
        filters.push(filter.string('uuid',this.filterValues.uuid));
        filters.push(filter.string('organizationUuid',this.filterValues.organizationUuid));
        return filter.and(filters);
      }
    };
  }

});

var UserGroups = Groups.extend({

  constructor: function(args){
    if(args && args.userId){
      this.setUserId(args.userId);
    }
    return Groups.prototype.constructor.apply(this,arguments);
  },

  setUserId: function(id){
    this.setEndpoint('gofer/security/rest/users/'+id+'/groups');
  },

  parse:function(resp){
    return resp.data.groups;
  },

  create:function(){
    throw new Error('This method is not supported. Add all models to this collection by calling the add method and call the method save afterwards');
  },

  save:function(){
    var groups = _.pluck(this.models, 'id');

    return Backbone.ajax({
      url: _.result(this,'url'),
      data: groups,
      type: 'PUT',
      instance: this,
      success:function(){}
  systemGroupIsSelected: function(){
    var systemGroupInSelection = false;
    this.selectable.getSelected().each(function(model){
      if(!systemGroupInSelection){
        systemGroupInSelection = model.isSystemGroup();
      }
    });
    return systemGroupInSelection;
  }

});

mCAP.Groups = Groups;
mCAP.UserGroups = UserGroups;
