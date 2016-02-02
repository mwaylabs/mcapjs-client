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
      customUrlParams: {
        getNonpagedCount: true
      },
      fields: ['uuid', 'name', 'description', 'readonly', 'groupType', 'organizationUuid'],
      filterDefinition: function () {
        var filter = new mCAP.Filter();

        var filters = [];

        if (this.filterValues.strictSearch) {
          filters.push(filter.string('name', this.filterValues.name));
        } else {
          filters.push(filter.containsString('name', this.filterValues.name));
        }

        if (this.filterValues.groupType === '') {
          filters.push(filter.stringEnum('groupType', ['GROUP', 'SYSTEM_GROUP']));
        } else {
          filters.push(filter.stringEnum('groupType', this.filterValues.groupType));
        }

        filters.push(filter.string('members', this.filterValues.members));
        filters.push(filter.string('uuid', this.filterValues.uuid));
        filters.push(filter.string('organizationUuid', this.filterValues.organizationUuid));
        return filter.and(filters);
      }
    };
  },
  systemGroupIsSelected: function () {
    var systemGroupInSelection = false;
    this.selectable.getSelected().each(function (model) {
      if (!systemGroupInSelection) {
        systemGroupInSelection = model.isSystemGroup();
      }
    });
    return systemGroupInSelection;
  }
});

mCAP.Groups = Groups;
