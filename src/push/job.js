/**
 * Push Job Model
 */
var Job = mCAP.Model.extend({

  idAttribute: 'uuid',

  defaults: {
    'message': '',
    'sound': '',
    'deviceFilter': null,
    'badge': 0,
    'extras': null
  },

  sendPush: function(){
    return this.save.apply(this, arguments);
  }

});

mCAP.Job = Job;
