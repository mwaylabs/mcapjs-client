var Organizations = mCAP.Collection.extend({

  endpoint: 'gofer/security/rest/organizations',

  model: mCAP.Organization,

  parse: function (resp) {
    return resp.data.items;
  }

});

mCAP.Organizations = Organizations;