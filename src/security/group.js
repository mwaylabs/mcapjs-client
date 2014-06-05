var Group = mCAP.Model.extend({

  endpoint: 'gofer/security/rest/groups',

  defaults: function(){
    return {
      uuid: null,
      name: '',
      version: 0,
      organizationUuid: '',
      description: null,
      roles: new mCAP.Roles(),
      members: new mCAP.Members(),
      aclEntries: [],
      effectivePermissions: '',
      sysRoles: [],
      systemPermission: false,
      bundle: null
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

  parse: function (resp) {
    var data = resp.data || resp,
      roles = new mCAP.Roles(null,{groupId: data.uuid}),
      members = new mCAP.Members(null,{groupId: data.uuid});

    if(data.roles){
      data.roles.forEach(function (role) {
        roles.add({uuid: role});
      });
    }

    if(data.members){
      data.members.forEach(function (member) {
        members.add({uuid: member});
      });
    }

    data.roles = roles;
    data.members = members;

    return data;
  }

});

mCAP.Group = Group;
