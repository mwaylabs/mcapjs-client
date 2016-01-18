var UsersAndGroupsHolderModel = mCAP.Model.extend({

  endpoint: 'gofer/form/rest/enumerables/paginatedPairs/roles',

  prepare: function(){
    return {
      users:new mCAP.Users(),
      groups:new mCAP.Groups()
    };
  },

  setReferencedCollections: function(attrs){

    var users = _.findWhere(attrs,{type:'USER'}),
      groups = _.findWhere(attrs,{type:'GROUP'});

    if(users || groups){
      if (!(attrs.users instanceof mCAP.Users) && this.get('users') && users) {
        this.get('users').add(_.where(attrs,{type:'USER'}));
      }

      if (!(attrs.groups instanceof mCAP.Groups) && this.get('groups') && groups) {
        this.get('groups').add(_.where(attrs,{type:'GROUP'}));
      }
      return;
    } else {
      return attrs;
    }
  },

  parse: function () {
    var data = mCAP.Model.prototype.parse.apply(this,arguments);
    return this.setReferencedCollections(data);
  },

  set: function (key, val, options) {
    key = this.setReferencedCollections(key);
    return mCAP.Model.prototype.set.apply(this, [key, val, options]);
  }

});

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

  prepare: function(){ // todo 1 es soll ein Organisation model geben
    return {
      roles: new UsersAndGroupsHolderModel(),
      members: new UsersAndGroupsHolderModel(),
      organization: new mCap.Organization()
    };
  },

  validate: function(attributes){
    if(!attributes.organizationUuid || attributes.organizationUuid.length<1){
      return 'Missing organization uuid';
    }
  },

  beforeSave: function(data){ //todo 3 umgekehrt zu schritt 2: json soll wieder uuid haben und kein model, bevor es zum server geschickt wird
    data.organizationUuid = this.get('organization').get('uuid');
    delete data.organization;

    if(data.roles){
      data.roles = _.union(this.get('roles').get('users').pluck('uuid'),this.get('roles').get('groups').pluck('uuid'));
    }

    if(data.members){
      data.members = _.union(this.get('members').get('users').pluck('uuid'),this.get('members').get('groups').pluck('uuid'));
    }

    return data;
  },

  setReferencedCollections: function(attrs){
    // todo 2   neues organisation model muss mit organisation verknüpft werden: uuid string in model konvertieren und danach string löschen
    if(attrs.organization && !(attrs.organization instanceof mCAP.Organization) && this.get('organization')){
      this.get('organization').set(attrs.organization);
      delete attrs.organization;
    }

    if(attrs.rolesObjects){
      this.get('roles').set(attrs.rolesObjects);
      delete attrs.rolesObjects;
      delete attrs.roles;
    }

    if(attrs.membersObjects){
      this.get('members').set(attrs.membersObjects);
      delete attrs.membersObjects;
      delete attrs.members;
    }

    //if(attrs.members && !(attrs.members instanceof mCAP.Members) && this.get('members')){
    //  attrs.members.forEach(function(member){
    //    this.get('members').add(member);
    //  },this);
    //  delete attrs.members;
    //}

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
  },

  isSystemGroup: function(){
    var groupType = this.get('groupType');
    return groupType === 'SYSTEM_GROUP' || groupType === 'SYSTEM_PERMISSION';
  }

});

mCAP.Group = Group;
