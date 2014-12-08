var Users = mCAP.Collection.extend({

  endpoint: 'gofer/security/rest/users',

  model: mCAP.User,

  parse: function(resp){
    if(this.filterable){
      this.filterable.setTotalAmount(resp.data.nonpagedCount);
    }
    return resp.data.items;
  },

  //customUrlParams:{
  //  getNonpagedCount:true
  //},

  filterableOptions: function(){
    return {
      sortOrder:'+name',
      filterValues: {
        name: ''
      },
      filterDefinition: function () {
        var filter = new mCAP.Filter();
        return filter.or([
          filter.containsString('name', this.filterValues.name),
          filter.containsString('givenName', this.filterValues.name),
          filter.containsString('surname', this.filterValues.name),
          filter.containsString('email', this.filterValues.name)
        ]);
      }
    };
  }

});

mCAP.Users = Users;