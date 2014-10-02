/**
 * Tags collection
 * @example
 * mCAP.push.tags.tags
 */
var Tags = mCAP.PushAppAttributeCollection.extend({

  /**
   * There is no model caused by the server response. The server just returns an string array with all tags.
   * @type {Array}
   */
  tags: null,

  endpoint: '/tags',

  /**
   * Tags are a simple string array - so there is no model
   * @param data
   */
  parse: function (data) {
    // set the tags
    this.tags = data;
  },

  /**
   * Caused by no model the get is overwritten to be API compliant.
   * @param key
   * @returns {*}
   */
  get: function(key){
    if(key === 'tag' || key === 'tags'){
      return this.tags;
    } else {
      return mCAP.PushAppAttributeCollection.prototype.get.apply(this, arguments);
    }
  },

  /**
   * Caused by no model the get is overwritten to be API compliant.
   * @param key
   * @returns {*}
   */
  set: function(key, val){
    if(key === 'tag' || key === 'tags'){
      this.tags = val;
      return this;
    } else {
      return mCAP.PushAppAttributeCollection.prototype.set.apply(this, arguments);
    }
  }

});

mCAP.Tags = Tags;