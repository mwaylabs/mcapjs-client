(function (root) {
  'use strict';

  var mCap = mCap || {},
    Backbone = root.Backbone,
    sync = Backbone.sync;

  Backbone.sync = function (method, model, options) {
    if (_.isUndefined(options.wait)) {
      options.wait = true;
    }
    return sync.apply(Backbone, [method, model, options]);
  };

  var Filterable = function (collectionInstance, options) {

    options = options || {};

    var _collection = collectionInstance,
      _limit = options.limit,
      _offset = options.offset,
      _page = options.page || 1,
      _perPage = options.perPage || 30,
      _filterValues = options.filterValues,
      _initialFilterValues = angular.copy(_filterValues),
      _filterDefinition = options.filterDefinition,
      _filters = options.filters,
      _sortOrder = null,
      _totalAmount;

    this.getRequestParams = function (method, model, options) {
      options.params = options.params || {};

      if (method === 'read') {
        // Filter functionality
        var filter = this.getFilters();
        if (filter) {
          options.params.filter = filter;
        }

        // Pagination functionality
        if (_perPage && _page) {
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
        if (_.has(_filterValues, key)) {
          _filterValues[key] = value;
        } else {
          throw new Error('Filter named \'' + key + '\' not found, did you add it to filterValues of the model?');
        }
      }, this);
    };

    this.setCustomFilters = function (customFilter) {
      _filters = customFilter;
    };

    this.getFilters = function () {
      // Custom filter definition existing?
      if (_.isFunction(_filterDefinition) && _filters === null) {
        return _filterDefinition();
      } else {
        return this._filters;
      }
    };

    this.resetFilters = function () {
      _filterValues = angular.copy(_initialFilterValues);
      _filters = null;
    };

    (function _main() {
      // TODO: load persisted filters into this.filterValues and sortOrder here
      // ....

      if (!_collection instanceof Backbone.Collection) {
        throw new Error('First parameter has to be the instance of a collection');
      }

    }());
  };

  var CollectionSelectable = function (collectionInstance) {

    var _collection = collectionInstance;

    this.getSelectedModels = function () {
      var selected = [];
      _collection.models.forEach(function (model) {
        if (model.selectable && model.selectable.isSelected()) {
          selected.push(model);
        }
      });
      return selected;
    };

    this.allModelsSelected = function () {
      return this.getSelectedModels().length === _collection.length;
    };

    this.allModelsDisabled = function () {
      var allDisabled = true;
      _collection.models.forEach(function (model) {
        if (model.selectable && allDisabled) {
          allDisabled = model.selectable.isDisabled();
        }
      });
      return allDisabled;
    };

    this.toggleSelectAllModels = function () {
      if (this.allModelsSelected()) {
        this.unSelectAllModels();
      } else {
        this.selectAllModels();
      }
    };

    this.selectAllModels = function () {
      _collection.models.forEach(function (model) {
        if (model.selectable) {
          model.selectable.select();
        }
      });
    };

    this.unSelectAllModels = function () {
      this.getSelectedModels().forEach(function (model) {
        if (model.selectable) {
          model.selectable.unSelect();
        }
      });
    };

    (function _main() {
      if (!_collection instanceof Backbone.Collection) {
        throw new Error('First parameter has to be the instance of a collection');
      }
    }());
  };

  var ModelSelectable = function (modelInstance, options) {

    var _model = modelInstance,
      _selected = options.selected || false;

    this.isDisabled = options.isDisabled || function () {
      return false;
    };

    this.isSelected = function () {
      return _selected;
    };

    this.select = function () {
      if (!this.isDisabled()) {
        _selected = true;
      }
    };

    this.unSelect = function () {
      _selected = false;
    };

    this.toggleSelect = function () {
      if (this.isSelected()) {
        this.unSelect();
      } else {
        this.select();
      }
    };

    (function _main() {
      if (!_model instanceof Backbone.Model) {
        throw new Error('First parameter has to be the instance of a collection');
      }
    }());
  };

  var SelectableFactory = function (instance, options) {
    if (instance instanceof Backbone.Model) {
      return new ModelSelectable(instance, options);
    } else if (instance instanceof Backbone.Collection) {
      return new CollectionSelectable(instance, options);
    }
  };

  mCap.Filter = function () {
    // If it is an invalid value return null otherwise the provided object
    var returnNullOrObjectFor = function (value, object) {
      return (!angular.isDefined(value) || value === null || value === '') ? null : object;
    };

    // See https://wiki.mwaysolutions.com/confluence/display/mCAPTECH/mCAP+REST+API#mCAPRESTAPI-Filter
    // for more information about mcap filter api
    return {
      containsString: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'containsString',
          fieldName: fieldName,
          contains: value
        });
      },

      and: function (filters) {
        return this.logOp(filters, 'AND');
      },

      nand: function (filters) {
        return this.logOp(filters, 'NAND');
      },

      or: function (filters) {
        return this.logOp(filters, 'OR');
      },

      logOp: function (filters, operator) {
        filters = _.without(filters, null); // Removing null values from existing filters

        return filters.length === 0 ? null : { // Ignore logOps with empty filters
          type: 'logOp',
          operation: operator,
          filters: filters
        };
      },

      boolean: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'boolean',
          fieldName: fieldName,
          value: value
        });
      },

      like: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'like',
          fieldName: fieldName,
          like: value
        });
      }
    };

  };

  root.mCap = mCap;

}(this));