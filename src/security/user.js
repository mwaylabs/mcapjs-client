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
    'roles': null
  },

  prepare: function(){
    return {
      groups: new mCAP.UserGroups()
    };
  },

  validate: function(){
    this.attributes.version++;
  },

  beforeSave: function(attributes){
    delete attributes.groups;
    delete attributes.roles;
    delete attributes.authenticated;
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

  parse: function (resp) {
   return resp.data || resp;
  },


  initialize: function(){
    mCAP.authentication.get('organization').on('change',function(){
      if(mCAP.authentication.get('organization')){
        this.set('organizationUuid',mCAP.authentication.get('organization').get('uuid'));
      }
    },this);

    this.once('change',function(model){
      this.get('groups').setUserId(model.id);
    },this);
  }

});

mCAP.User = User;
