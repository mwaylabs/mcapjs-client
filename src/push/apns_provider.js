/**
 * ApnsProvider
 */
var ApnsProvider = mCAP.Model.extend({

  endpoint: '/apnsProvider',

  defaults: {
    'certificate': null,
    'passphrase': null
  },

  initialize: function (child, push) {
    this.push = push;
    return mCAP.Model.prototype.initialize.apply(this, arguments);
  },

  upload: function () {
    return this.sync();
  },

  setEndpoint: function (endpoint) {
    this.url = function () {
      // take the 'parent' url and append the own endpoint
      return URI(this.push.url() + endpoint).normalize().toString();
    };
  },

  sync: function (method, model, options) {

    model = model || this;
    // Post data as FormData object on create to allow file upload

    var formData = new FormData();

    formData.append('passphrase', this.get('passphrase'));
    formData.append('certificate', this.get('certificate'));

    // Set processData and contentType to false so data is sent as FormData
    _.defaults(options || (options = {}), {
      url: this.url(),
      data: formData,
      type: 'PUT',
      processData: false,
      contentType: false,
      xhr: function(){
        // get the native XmlHttpRequest object
        var xhr = $.ajaxSettings.xhr();
        // set the onprogress event handler
        xhr.upload.onprogress = function(event) {
          // console.log('%d%', (event.loaded / event.total) * 100);
          // Trigger progress event on model for view updates
          model.trigger('progress', (event.loaded / event.total) * 100);
        };
        // set the onload event handler
        xhr.upload.onload = function(){
          model.trigger('progress', 100);
        };
        // return the customized object
        return xhr;
      }
    });
    return Backbone.sync.call(this, method, model, options).then(function(attributes){
      // update the apns provider details after saving
      model.push.update(attributes);
      return arguments;
    });
  }

});

mCAP.ApnsProvider = ApnsProvider;

/*
Usage
var apnsProvider = new ApnsProvider({
  url: function () {
    return push.url()
  }
});

// <input id="file" type="file">
// <input id="password" type="password">
var apnsProviderFile = $('#file')[0].files[0];
var apnsProviderPassword = this.$el.find('#password').val();

apnsProvider.set('certificate', apnsProviderFile);
apnsProvider.set('passphrase', apnsProviderPassword);

apnsProvider.upload();
  */