var Tags = mCAP.PushAppAttributeCollection.extend({

  tags: null,

  endpoint: '/tags',

  parse: function (data) {
    this.tags = data;
  }

});

mCAP.Tags = Tags;