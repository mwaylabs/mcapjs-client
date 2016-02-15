var Organization = mCAP.Model.extend({

  endpoint: 'gofer/security/rest/organizations',

  defaults: function () {
    return {
      name: '',
      uniqueName: ''
    };
  },

  prepare: function () {
    return {
      passcodePolicy: new mCAP.PasscodePolicy(),
      user: new ( mCAP.User.extend({
        prepare: function () {
          return {
            groups: new mCAP.Groups()
          };
        },
        initialize: function () {}
      }) )()
    };
  },

  beforeSave: function (attrs) {
    attrs.passwordPolicy = this.get('passcodePolicy').toJSON();
    delete attrs.passcodePolicy;

    if (this.isNew()) {
      attrs.orgaName = attrs.uniqueName;
      attrs.orgaFullName = attrs.name;
      attrs.orgaContactName = this.get('user').getFullName();
      attrs.orgaContactEMail = this.get('user').get('email');

      attrs.orgaAdminUser = this.get('user').get('name');
      attrs.orgaAdminGivenName = this.get('user').get('givenName');
      attrs.orgaAdminSurName = this.get('user').get('surname');
      attrs.orgaAdminPwd = this.get('user').get('password');
      attrs.orgaAdminEmail = this.get('user').get('email');
    }

    delete attrs.user;

    return attrs;
  },

  setReferencedCollections: function (attrs) {

    if (attrs.passwordPolicy && !(attrs.passwordPolicy instanceof mCAP.PasscodePolicy) && this.get('passcodePolicy')) {
      this.get('passcodePolicy').set(attrs.passwordPolicy);
      delete attrs.passwordPolicy;
    }

    if (attrs.createdUser) {
      this.get('user').set('uuid', attrs.createdUser);
    }

    return attrs;
  },

  set: function (key, val, options) {
    key = this.setReferencedCollections(key);
    return mCAP.Model.prototype.set.apply(this, [key, val, options]);
  },

  parse: function () {
    var data = mCAP.Model.prototype.parse.apply(this, arguments);
    if(data.orgaId){
      data.uuid = data.orgaId;
      delete data.orgaId;
    }
    if(data.orgaName){
      data.uniqueName = data.orgaName;
      delete data.orgaName;
    }
    return this.setReferencedCollections(data);
  },

  save: function () {
    var endPoint = this.getEndpoint();
    if (this.isNew()) {
      this.setEndpoint('relution/api/v1/wizard');
    }
    return mCAP.Model.prototype.save.apply(this, arguments).then(function (model) {
      this.setEndpoint(endPoint);
      return model;
    }.bind(this));
  },

  destroy: function () {
    var endPoint = this.getEndpoint();
    this.setEndpoint('relution/api/v1/cleanup');
    return mCAP.Model.prototype.destroy.apply(this, arguments).then(function (model) {
      this.setEndpoint(endPoint);
      return model;
    }.bind(this));
  },

  makeLicenseHandshake: function(){
    var options = {
      url: this.url() + '/handshake-license',
      type: 'POST',
      instance: this
    };
    return window.mCAP.Utils.request(options).then(function(rsp){
      this.set(rsp.data);
      return this;
    }.bind(this));
  }

});

mCAP.Organization = Organization;
