var Jobs = mCAP.Collection.extend({

  endpoint: '/jobs',

  model: mCAP.Job,

  setEndpoint: function (endpoint) {
    this.url = function () {
      return URI(mCAP.push.url() + mCAP.application.get('pushService') + endpoint).normalize().toString();
    };
  },

  parse: function( data ){
    if (data && data.items) {
      return data.items;
    }
    return data;
  }
});

mCAP.Jobs = Jobs;