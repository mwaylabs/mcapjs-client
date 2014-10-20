var Group = mCAP.Model.extend({

  endpoint: 'gofer/security/rest/groups',

  defaults: function(){
    return {
      uuid: null,
      name: '',
      version: 0,
      organizationUuid: null,
      description: null,
      roles: null,
      members: null,
      aclEntries: [],
      effectivePermissions: '',
      sysRoles: [],
      systemPermission: false,
      bundle: null
    };
  },

  prepare: function(){
    return {
      roles:new mCAP.Roles(),
      members:new mCAP.Members()
    };
  },

  validate: function(attributes){
    if(!attributes.organizationUuid || attributes.organizationUuid.length<1){
      return 'Missing organization uuid';
    }
    this.attributes.version++;
  },

  beforeSave: function(data){
    var roles = [],
      members = [];

    if(data.members){
      data.members.each(function(memberModel){
        members.push(memberModel.id);
      });
    }

    if(data.roles){
      data.roles.each(function(roleModel){
        roles.push(roleModel.id);
      });
    }

    data.roles = roles;
    data.members = members;
    return data;
  },

  setReferencedCollections: function(attrs){

    if(attrs.roles && !(attrs.roles instanceof mCAP.Roles) && this.get('roles')){
      attrs.roles.forEach(function(role){
        this.get('roles').add({uuid:role});
      },this);
      delete attrs.roles;
    }

    if(attrs.members && !(attrs.members instanceof mCAP.Members) && this.get('members')){
      attrs.members.forEach(function(member){
        this.get('members').add({uuid:member});
      },this);
      delete attrs.members;
    }

    return attrs;
  },

  set: function(key, val, options){
    key = this.setReferencedCollections(key);
    return mCAP.Model.prototype.set.apply(this,[key, val, options]);
  },

  parse: function (attrs) {
    attrs = attrs.data || attrs;
    return this.setReferencedCollections(attrs);
  },

  initialize: function(){
    this.set('organizationUuid',mCAP.currentOrganization.get('uuid'));
    mCAP.currentOrganization.on('change',function(){
      if(!this.get('organizationUuid')){
        this.set('organizationUuid',mCAP.currentOrganization.get('uuid'));
      }
    },this);
  }

});

mCAP.Group = Group;
