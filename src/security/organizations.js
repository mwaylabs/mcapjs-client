var Organizations = mCAP.Collection.extend({

  endpoint: 'gofer/security/rest/organizations',

  model: mCAP.Organization,

  parse: function (resp) {
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
          generalFilters.push(filter.string('uniqueName', this.filterValues.name));
        } else {
          generalFilters.push(filter.containsString('uniqueName', this.filterValues.name));
        }

        searchFilters = [
          filter.containsString('name', this.filterValues.search),
          filter.containsString('uniqueName', this.filterValues.search)
        ];

        generalFilters.push(filter.or(searchFilters));

        return filter.and(generalFilters);
      }
    };
  }

});

mCAP.Organizations = Organizations;