/*jshint unused:false */
var Filterable = function (collectionInstance, options) {

  options = options || {};

  var _collection = collectionInstance,
      _limit = options.limit,
      _offset = _limit ? options.offset : false,
      _page = options.page || 1,
      _perPage = options.perPage || 30,
      _initialFilterValues = options.filterValues ? JSON.parse(JSON.stringify(options.filterValues)) : options.filterValues,
      _filterDefinition = options.filterDefinition,
      _sortOrder = options.sortOrder,
      _totalAmount;

  this.filterValues = options.filterValues;
  this.customUrlParams = options.customUrlParams;

  this.getRequestParams = function (method, model, options) {
    options.params = options.params || {};

    if (method === 'read') {
      // Filter functionality
      var filter = this.getFilters();
      if (filter) {
        options.params.filter = filter;
      }

      // Pagination functionality
      if (_perPage && _page && (_limit || _.isUndefined(_limit))) {
        options.params.limit = _perPage;

        // Calculate offset
        options.params.offset = _page > 1 ? _perPage * (_page - 1) : 0;
      }

      // Sort order
      if (_sortOrder) {
        options.params.sortOrder = _sortOrder;
      }

      // Fallback to limit and offset if they're set manually, overwrites pagination settings
      if (_limit || _offset) {
        options.params.limit = _limit;
        options.params.offset = _offset;
      }

      // Custom URL parameters
      if (this.customUrlParams) {
        _.extend(options.params, this.customUrlParams);
      }

      return options;
    }
  };

  this.setTotalAmount = function (totalAmount) {
    _totalAmount = totalAmount;
  };

  this.getTotalAmount = function () {
    return _totalAmount;
  };

  this.loadPreviousPage = function () {
    _page -= 1;
    _collection.fetch({remove: false});
  };

  this.hasPreviousPage = function () {
    return _page >= 1;
  };

  this.loadNextPage = function () {
    _page += 1;
    _collection.fetch({remove: false});
  };

  this.hasNextPage = function () {
    return _totalAmount && _totalAmount > _collection.length;
  };

  this.getPage = function () {
    return _page;
  };

  this.getTotalPages = function () {
    return Math.floor(_totalAmount / _perPage);
  };

  this.setSortOrder = function (sortOrder) {
    // TODO: persist sortOrder here
    // ....
    _sortOrder = sortOrder;
  };

  this.getSortOrder = function () {
    return _sortOrder;
  };

  this.setFilters = function (filterMap) {

    _.forEach(filterMap, function (value, key) {
      if (_.has(this.filterValues, key)) {
        this.filterValues[key] = value;
      } else {
        throw new Error('Filter named \'' + key + '\' not found, did you add it to filterValues of the model?');
      }
    }, this);
  };

  this.getFilters = function () {
    if (_.isFunction(_filterDefinition)) {
      return _filterDefinition.apply(this);
    }
  };

  this.resetFilters = function () {
    this.filterValues = _initialFilterValues ? JSON.parse(JSON.stringify(_initialFilterValues)) : _initialFilterValues;
  };

  (function _main() {
    // TODO: load persisted filters into this.filterValues and sortOrder here
    // ....

    if (!_collection instanceof Backbone.Collection) {
      throw new Error('First parameter has to be the instance of a collection');
    }

  }());
};