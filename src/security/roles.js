var Roles = mCAP.Collection.extend({

  endpoint: 'gofer/form/rest/enumerables/paginatedPairs/roles',

  model: mCAP.Role,

  parse: function (resp) {
    var items = resp.data.items,
      roles = [];
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
