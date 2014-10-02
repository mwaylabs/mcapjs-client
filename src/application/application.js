var Application = mCAP.Model.extend({

  defaults: {
    'baseUrl': '',
    'pushServiceApiVersion': 'v1'
  }

});

mCAP.application = new Application();