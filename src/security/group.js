var Group = mCAP.Model.extend({

  endpoint: 'gofer/security/rest/groups',

  defaults: {
    uuid: '',
    name: '',
    organizationUuid: '',
    description: null,
    roles: [],
    members: [],
    aclEntries: [],
    effectivePermissions: '',
    sysRoles: [],
    systemPermission: false,
    bundle: null
  },

  parse: function (resp) {
    return resp.data || resp;
  }

});

mCAP.Group = Group;
