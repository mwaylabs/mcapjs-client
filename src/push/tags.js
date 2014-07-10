var Tags = mCAP.Collection.extend({

  tags: null,
  endpoint: '/tags',

  setEndpoint: function (endpoint) {
    this.url = function () {
      return URI(mCAP.push.url() + mCAP.application.get('pushService') + endpoint).normalize().toString();
    };
  },

  parse: function(data){
    this.tags = data;
  }

});

mCAP.Tags = Tags;