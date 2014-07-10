var Job = mCAP.Model.extend({

  idAttribute: 'uuid',

  defaults: {
    'message': '',
    'sound': '',
    'deviceFilter': null
  }

});

mCAP.Job = Job;
