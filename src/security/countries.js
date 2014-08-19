var Countries = mCAP.Collection.extend({

  endpoint: 'gofer/form/rest/enumerables/pairs/localeCountries',

  model: mCAP.Model.extend({
    idAttribute: 'value'
  }),

  parse: function (resp) {
    return resp.data;
  }

});

mCAP.Countries = Countries;