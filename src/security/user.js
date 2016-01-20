var User = mCAP.Model.extend({

  endpoint: 'gofer/security/rest/users',

  defaults: function () {
    return {
      'uuid': null,
      'name': '',
      'salutation': null,
      'givenName': '',
      'surname': '',
      'position': null,
      'email': '',
      'phone': null,
      'country': null,
      'password': '',
      'locked': false,
      'activated': true,
      'version': 0,
      'aclEntries': [],
      'groups': null
    };
  },

  prepare: function () {
    return {
      groups: new mCAP.Groups(),
      organization: new mCAP.Organization()
    };
  },

  beforeSave: function (attributes) {
    attributes.roles = this.get('groups').pluck('uuid');
    attributes.organizationUuid = this.get('organization').get('uuid');

    delete attributes.groups;
    delete attributes.organization;
    delete attributes.authenticated;
    if (attributes.password === '' || attributes.password === null) {
      delete attributes.password;
    }
    if (attributes.phone === '' || attributes.phone === null) {
      delete attributes.phone;
    }

    return attributes;
  },

  setReferencedCollections: function (obj) {
    if (obj.organizationUuid) {
      this.get('organization').set({uuid: obj.organizationUuid});
      delete obj.organizationUuid;
    }

    if (obj.rolesObjects && !(obj.rolesObjects instanceof mCAP.Groups) && this.get('groups')) {
      this.get('groups').add(obj.rolesObjects);
      delete obj.rolesObjects;
      delete obj.roles;
    }

    if (obj.roles && !(obj.roles instanceof mCAP.Groups) && this.get('groups')) {
      this.get('groups').add(obj.roles);
      delete obj.roles;
    }

    return obj;
  },

  parse: function (resp) {
    var data = resp.data || resp;
    return this.setReferencedCollections(data);
  },

  set: function (key, val, options) {
    key = this.setReferencedCollections(key);
    return mCAP.Model.prototype.set.apply(this, [key, val, options]);
  },

  loginAs: function () {
    var options = {
      url: this.getEndpoint() + 'gofer/security-login-as',
      type: 'GET',
      //jshint -W106
      params: {
        j_user_uuid: this.get('uuid')
      },
      //jshint +W106
      instance: this
    };
    return window.mCAP.Utils.request(options);
  },

  resetPassword: function () {
    var options = {
      url: this.getEndpoint() + '/createPasswordResetRequest',
      type: 'PUT',
      params: {
        userIdentifier: this.get('name'),
        organizationName: mCAP.currentOrganization.get('uniqueName')
      },
      instance: this
    };
    return window.mCAP.Utils.request(options);
  },

  changePassword: function (newPassword) {
    var options = {
      url: this.getEndpoint() + '/' + this.get('uuid') + '/changePassword',
      type: 'PUT',
      data: {
        newPassword: newPassword
      },
      instance: this
    };
    return window.mCAP.Utils.request(options);
  },

  isLocked: function () {
    return (this.get('readonly') || this.get('locked'));
  },

  getFullName: function () {
    if (this.get('givenName') && this.get('surname')) {
      return this.get('givenName') + ' ' + this.get('surname');
    } else if (this.get('name')) {
      return this.get('name');
    } else {
      return false;
    }
  },

  _setDefaultOrgaUuid: function () {
    var organization = this.get('organization'),
      organizationUuid = organization.get('uuid'),
      currentOrganizationUuid = mCAP.currentOrganization.get('uuid');

    if (!organizationUuid && currentOrganizationUuid) {
      organization.set('uuid', currentOrganizationUuid);
    }
  },

  initialize: function () {
    this._setDefaultOrgaUuid();
    mCAP.currentOrganization.once('change:uuid', this._setDefaultOrgaUuid, this);
  }

});

mCAP.User = User;
