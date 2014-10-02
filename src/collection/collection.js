var Filterable = Filterable || {},
  SelectableFactory = SelectableFactory || {};

var Collection = Backbone.Collection.extend({

  selectable: true,
  filterable: true,
  filterableOptions: {},
  selectableOptions: {},

  model: mCAP.Model,

  constructor: function () {
    if (this.selectable) {
      this.selectable = new SelectableFactory(this,  _.result(this,'selectableOptions'));
    }

    if (this.filterable) {
      this.filterable = new Filterable(this, _.result(this,'filterableOptions'));
    }

    if (this.endpoint) {
      this.setEndpoint(this.endpoint);
    }

    return Backbone.Collection.prototype.constructor.apply(this, arguments);
  },

  setEndpoint: function (endpoint) {
    this.url = function(){
      return URI(mCAP.application.get('baseUrl') + '/' + endpoint).normalize().toString();
    };
  },

  parse: function (response) {
    response.data = response.data || {};
    if (this.filterable) {
      this.filterable.setTotalAmount(response.data.total || 0);
    }
    return response.data.results;
  },

  sync: function (method, model, options) {
    if (this.filterable) {
      var params = this.filterable.getRequestParams.apply(this.filterable, arguments);
      options = params;
    }
    options = mCAP.Utils.setAuthenticationEvent(options);
    return Backbone.Collection.prototype.sync.apply(this, [method, model, options]);
  },

  replace: function(models){
    this.reset(models);
    this.trigger('replace',this);
  },

  /*
   * README: Why are we doing this??
   *
   * The initialize method of a  model is not always called at the same time
   * When the model instance is created by the collection the parse method is called before
   * For referenced collections/models we need to set them up before the parse method is called
   * We Can not do this in the attributes field because the default attributes are set after the parse method
   * The only solution is that we have a function that comes always before the parse method and that is also
   * called when a model instance is created manually(not by a collection)
   * The following code get the prototype function of the original parse method which is then overwritten by our
   * custom 'prepare' function. After the prepared has been called we call the original parse method
   *
   * New Execution order of functions:
   * create new Model(): prepare() > initialize()
   * Colellection creates model instance: prepare() > parse() > initialize()
   */

  _prepareModel: function(model,options){
    var orgParse = this.model.prototype.parse,
        collection = this,
        preparedAttrs = {},
        parsedAttrs = {};

    //if(model.uuid ==='2345423543252')debugger;

    //Inject the function which should be called before the parse method into the original parse method
    if(options.parse){
      this.model.prototype.parse = function(){
        if(!this._prepared){
          preparedAttrs = collection.model.prototype.prepare.apply(this,arguments);
          this.set(preparedAttrs);
          this._prepared = true;
        }
        this.parse = orgParse;
        parsedAttrs = this.parse.apply(this,arguments);
        //Merge the attributes which are then set as model attributes
        return _.extend(parsedAttrs,preparedAttrs);
      };
    }

    return Backbone.Collection.prototype._prepareModel.apply(this,arguments);
  }

});

mCAP.Collection = Collection;

