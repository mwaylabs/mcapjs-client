var User = mCAP.Model.extend({

  endpoint: 'gofer/security/rest/users',

  defaults: {
    'uuid': null,
    'name': '',
    'salutation': null,
    'givenName': '',
    'surname': '',
    'position': null,
    'email': '',
    'phone': null,
    'country': null,
    'lastLoggedTime': 0,
    'passwordExpires': null,
    'locked': false,
    'activated': true,
    'version': 0,
    'aclEntries': [],
    'preferences': {},
    'groups': null,
    'roles': []
  },

  parse: function (resp) {
    var data = resp.data || resp;
    if(this.attributes && !this.attributes.groups){
      data.groups = new mCAP.UserGroups({userId: this.id});
    }
    return resp.data || resp;
  },

  validate: function(){
    this.attributes.version++;
  },

  beforeSave: function(attributes){
    delete attributes.groups;
    delete attributes.roles;
    if(attributes.password==='' || attributes.password===null){
      delete attributes.password;
    }
    return attributes;
  },

  save: function(){
    return mCAP.Model.prototype.save.apply(this,arguments);
  }

});

mCAP.User = User;
