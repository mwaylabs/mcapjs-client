/**
 * Created by zarges on 19/10/15.
 */
var FilterHolder = mCAP.Model.extend({

  endpoint: 'gofer/filter/rest/filterHolders',

  defaults: function () {
    return {
      aclEntries: [],
      filter: null,
      group: '',
      name: '',
      version: 0,
      filterValues: {},
      customUrlParams: {}
    };
  },

  _parseFilterToValuesAndUrlParams: function (filter, result) {
    result = result || {};
    if (filter.type === 'logOp') {
      filter.filters.forEach(function (filter) {
        this._parseFilterToValuesAndUrlParams(filter, result);
      }, this);
      return result;
    } else {
      if (filter.fieldName === '__filterValues__') {
        result.filterValues = JSON.parse(filter.value);
      }
      if (filter.fieldName === '__customUrlParams__') {
        result.customUrlParams = JSON.parse(filter.value);
      }
      return result;
    }
  },

  parse: function () {
    var parsed = mCAP.Model.prototype.parse.apply(this, arguments),
        data = parsed.data || parsed,
        result = this._parseFilterToValuesAndUrlParams(data.filter, {});

    if (result.filterValues) {
      data.filterValues = result.filterValues;
    }
    if (result.customUrlParams) {
      data.customUrlParams = result.customUrlParams;
    }

    return data;
  },

  beforeSave: function (attrs) {
    var currentUserUuid = mCAP.authenticatedUser.get('uuid');
    if (currentUserUuid) {
      attrs.aclEntries.push(currentUserUuid + ':rw');
    }
    attrs.version += 1;

    var filters = [];
    if (_.size(attrs.filterValues) > 0) {
      var filterValuesFilter = (new mCAP.Filter()).string('__filterValues__', JSON.stringify(attrs.filterValues));
      filters.push(filterValuesFilter);
    }
    if (_.size(attrs.customUrlParams) > 0) {
      var customUrlParamsFilter = (new mCAP.Filter()).string('__customUrlParams__', JSON.stringify(attrs.customUrlParams));
      filters.push(customUrlParamsFilter);
    }
    if (filters.length > 0) {
      attrs.filter = (new mCAP.Filter()).or(filters);
    }

    delete attrs.totalAmount;
    delete attrs.filterValues;
    delete attrs.customUrlParams;
    return attrs;
  },

  isValid: function () {
    var name = this.get('name'),
      filterValues = this.get('filterValues'),
      urlParams = this.get('customUrlParams');

    return (name && name.length > 0 && ( (filterValues && _.size(filterValues) > 0) || (urlParams && _.size(urlParams) > 0) ) );
  }

});

mCAP.FilterHolder = FilterHolder;