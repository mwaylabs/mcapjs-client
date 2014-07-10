var Push = mCAP.Model.extend({

  endpoint: '/push/api/' + mCAP.application.get('pushServiceApiVersion') + '/apps/',

  defaults: {

  },
  tags : null,
  jobs : new mCAP.Jobs(),
  devices: new mCAP.Devices(),
  MCAP: 'MCAP'

});

mCAP.push = new Push();