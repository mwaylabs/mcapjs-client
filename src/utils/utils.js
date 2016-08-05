/**
 * Utils namespace
 * @type {Object}
 */
mCAP.Utils = {};

mCAP.Utils.getUrl = function(endpoint){
  if(endpoint.charAt(0)==='/'){
    endpoint = endpoint.substr(1);
  }
  return mCAP.baseUrl + '/' + endpoint;
};