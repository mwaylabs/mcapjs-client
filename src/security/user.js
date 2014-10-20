var User = mCAP.Model.extend({

  endpoint: 'gofer/security/rest/users',

  defaults: function () {
    return {
      'name': '',
      'salutation': null,
      'givenName': '',
      'surname': '',
      'position': null,
      'email': '',
      'phone': null,
      'country': null,
      'password': '',
      'organization': null,
      'locked': false,
      'activated': true,
      'version': 0,
      'aclEntries': [],
      'groups': null,
      'roles': null
    };
  },

  prepare: function () {
    return {
      groups: new mCAP.UserGroups(),
      organization: new mCAP.Organization()
    };
  },

  validate: function () {
    this.attributes.version++;
  },

  beforeSave: function (attributes) {
    delete attributes.groups;
    delete attributes.roles;
    delete attributes.authenticated;
    attributes.organizationUuid = this.get('organization').get('uuid');
    delete attributes.organization;
    if (attributes.password === '' || attributes.password === null) {
      delete attributes.password;
    }
    return attributes;
  },

  save: function () {
    var self = this;
    return mCAP.Model.prototype.save.apply(this, arguments).then(function (userModel) {
      return self.get('groups').save().then(function () {
        return userModel;
      });
    });
  },


  setReferencedCollections: function(obj){
    if(obj.organization && !(obj.organization instanceof mCAP.Organization) && this.get('organization')){
      this.get('organization').set(obj.organization);
      delete obj.organization;
    }

    if(obj.groups && !(obj.groups instanceof mCAP.Groups) && this.get('groups')){
      this.get('groups').add(obj.groups);
      delete obj.groups;
    }

    return obj;
  },

  parse: function (resp) {
    var data = resp.data || resp;
    this.get('organization').set('uuid', data.organizationUuid);
    delete data.organizationUuid;
    return this.setReferencedCollections(data);
  },

  set: function(key, val, options){
    key = this.setReferencedCollections(key);
    return mCAP.Model.prototype.set.apply(this,[key, val, options]);
  },

  initialize: function () {
    this.get('organization').set('uuid', mCAP.currentOrganization.get('uuid'));
    mCAP.currentOrganization.on('change', function () {
      if(!this.get('organization')){
        this.get('organization').set('uuid', mCAP.currentOrganization.get('uuid'));
      }
    }, this);

    this.once('change', function (model) {
      this.get('groups').setUserId(model.id);
    }, this);
  }

});

mCAP.User = User;
