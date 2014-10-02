/**
 * Utils namespace
 * @type {Object}
 */
mCAP.Utils = {};

/**
 * Returns the component type enum of the given model
 * Compare the return value with an mCAP constant/global
 * @param model
 * @returns {string}
 */
mCAP.Utils.getComponentType = function (model) {
  if(mCAP.PushApp.prototype.isPrototypeOf(model)){
    return mCAP.PUSH_SERVICE;
  }
};


mCAP.Utils.setAuthenticationEvent = function(options){
  var error = options.error;
  options.error = function(xhr, state, resp){
    if(xhr.status === 401){
      mCAP.authentication._triggerEvent('unauthorized', arguments);
    }
    if(typeof error === 'function'){
      error(xhr, state, resp);
    }
  };
  return options;
};