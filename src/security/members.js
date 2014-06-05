var Members = mCAP.Collection.extend({

  endpoint: 'gofer/form/rest/enumerables/paginatedPairs/members',

  model: mCAP.Member,

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

mCAP.Members = Members;
