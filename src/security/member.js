var Member = mCAP.Model.extend({

  endpoint: 'gofer/form/rest/enumerables/paginatedPairs/members',

  defaults: {
    uuid: null,
    name: ''
  }

});

mCAP.Member = Member;
