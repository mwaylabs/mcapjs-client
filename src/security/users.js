var Users = mCAP.Collection.extend({

  endpoint: 'gofer/security/rest/users',

  model: mCAP.User,

  parse: function(resp){
    if(this.filterable){
      this.filterable.setTotalAmount(resp.data.nonpagedCount);
    }
    return resp.data.items;
  },

  filterableOptions: function(){
    return {
      sortOrder:'+name',
      filterValues: {
        search: '',
        strictSearch: false,
        name: ''
      },
      customUrlParams:{
        getNonpagedCount:true
      },
      filterDefinition: function () {
        var filter = new mCAP.Filter(),
            generalFilters = [],
            searchFilters;

        if(this.filterValues.strictSearch){
          generalFilters.push(filter.string('name', this.filterValues.name));
        } else {
          generalFilters.push(filter.containsString('name', this.filterValues.name));
        }

        searchFilters = [
          filter.containsString('name', this.filterValues.search),
          filter.containsString('givenName', this.filterValues.search),
          filter.containsString('surname', this.filterValues.search),
          filter.containsString('email', this.filterValues.search)
        ];

        generalFilters.push(filter.or(searchFilters));

        return filter.and(generalFilters);
      }
    };
  }

});

mCAP.Users = Users;