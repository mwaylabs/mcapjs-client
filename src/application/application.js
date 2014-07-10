var Application = mCAP.Model.extend({

  defaults: {
    'baseUrl': '',
    'pushService': '',
    'pushServiceApiVersion': 'v1'
  }

});

mCAP.application = new Application();