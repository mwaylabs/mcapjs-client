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
        systemPermission: true
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

mCAP.Groups = Groups;
