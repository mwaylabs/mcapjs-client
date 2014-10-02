var Roles = mCAP.Collection.extend({

  endpoint: 'gofer/form/rest/enumerables/paginatedPairs/roles',

  model: mCAP.Role,

  parse: function (resp) {
    var items = resp.data.items,
      roles = [];

    if (this.filterable) {
      this.filterable.setTotalAmount(resp.data.nonpagedCount || 0);
    }

    items.forEach(function (item) {
      roles.push({
        uuid: item.value,
        name: item.label
      });
    });
    return roles;
  }
});

mCAP.Roles = Roles;
