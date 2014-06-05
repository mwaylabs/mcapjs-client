var Role = mCAP.Model.extend({

  endpoint: 'gofer/form/rest/enumerables/paginatedPairs/roles',

  defaults: {
    uuid: null,
    name: ''
  }

});

mCAP.Role = Role;
