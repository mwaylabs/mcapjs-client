var SelectableFactory = SelectableFactory || {};

var Model = Backbone.Model.extend({

  idAttribute: 'uuid',
  // default the model is selectable - set to false to turn selectable off
  selectable: true,
  selectableOptions: null,
  queryParameter: null,
  constructor: function () {
    // When a model gets removed, make sure to decrement the total count on the collection
    this.on('destroy', function () {
      if (this.collection && this.collection.filterable && this.collection.filterable.getTotalAmount() > 0) {
        this.collection.filterable.setTotalAmount(this.collection.filterable.getTotalAmount() - 1);
      }
    }, this);

    if (this.selectable) {
      var options = this.selectableOptions || {};
      this.selectable = new SelectableFactory(this, options);
    }

    if (typeof this.endpoint === 'string') {
      this.setEndpoint(this.endpoint);
    }

    return Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  setQueryParameter: function(attr,value){
    this.queryParameter = this.queryParameter || {};
    if(typeof attr === 'string'){
      this.queryParameter[attr]=value;
    }
  },

  removeQueryParameter: function(attr){
    if(this.queryParameter && attr && this.queryParameter[attr]){
      delete this.queryParameter[attr];
    }
  },

  setEndpoint: function (endpoint) {
    this.urlRoot = function () {
      if (mCap.application.get('baseUrl').slice(-1) === '/' && endpoint[0] === '/') {
        return mCap.application.get('baseUrl') + endpoint.substr(1);
      } else if (mCap.application.get('baseUrl').slice(-1) !== '/' && endpoint[0] !== '/') {
        return mCap.application.get('baseUrl') + '/' + endpoint;
      }
      return mCap.application.get('baseUrl') + endpoint;
    };
  },

  parse: function (response) {
    // For standalone models, parse the response
    if (response && response.data && response.data.results && response.data.results.length >= 0 && typeof response.data.results[0] !== 'undefined') {
      return response.data.results[0];
      // If Model is embedded in collection, it's already parsed correctly
    } else {
      return response;
    }
  },

  url: function(){
    var url = Backbone.Model.prototype.url.apply(this,arguments);
    if(this.queryParameter){
      url+='?'+Backbone.$.param(this.queryParameter);
    }
    return url;
  }

});

mCap.Model = Model;