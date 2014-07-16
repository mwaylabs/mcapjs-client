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