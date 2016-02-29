var AllOrganizations = mCAP.Organizations.extend({
  filterableOptions: function(){
    var superFilterOptions = mCAP.Organizations.prototype.filterableOptions.apply(this,arguments);
    superFilterOptions.limit = false;
    superFilterOptions.fields = ['uuid','name'];
    return superFilterOptions;
  }

});

mCAP.AllOrganizations = AllOrganizations;