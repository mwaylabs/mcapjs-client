var User = mCAP.Model.extend({

  endpoint: 'gofer/security/rest/users',

  defaults: {
    'name': '',
    'salutation': null,
    'givenName': '',
    'surname': '',
    'position': null,
    'email': '',
    'phone': null,
    'country': null,
    'password': '',
    'organizationUuid':null,
    'locked': false,
    'activated': true,
    'version': 0,
    'aclEntries': [],
    'groups': null,
    'roles': []
  },

  parse: function (resp) {
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
    var self = this;
    return mCAP.Model.prototype.save.apply(this,arguments).then(function(userModel){
       return self.get('groups').save().then(function(){
         return userModel;
       });
    });
  },

  initialize: function(){
    mCAP.authentication.on('change:organization',function(){
      if(mCAP.authentication.get('organization')){
        this.set('organizationUuid',mCAP.authentication.get('organization').get('uuid'));
      }
    },this);

    this.set('groups',new mCAP.UserGroups());
    this.once('change:id',function(model){
      this.get('groups').setUserId(model.id);
    },this);
  }

});

mCAP.User = User;
