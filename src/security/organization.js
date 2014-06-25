var Organization = mCAP.Model.extend({

  endpoint: 'gofer/security/rest/organizations',

  defaults: {
    'uuid': null,
    'aclEntries': null,
    'name': null,
    'uniqueName': null,
    'address': null,
    'billingSettings': null,
    'technicalPerson': null,
    'assetPath': null,
    'reportLocaleString': null,
    'defaultRoles': null,
    'version': null,
    'effectivePermissions': null
  }

});

mCAP.Organization = Organization;
