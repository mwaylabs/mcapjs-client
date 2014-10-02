/**
 * Push Job Collection
 */
var Jobs = mCAP.PushAppAttributeCollection.extend({

  endpoint: '/jobs',

  model: mCAP.Job,

  parse: function( data ){
    if (data && data.items) {
      return data.items;
    }
    return data;
  }
});

mCAP.Jobs = Jobs;