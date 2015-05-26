/**
 * Send a request to with the given settings
 * @param settings
 * url: request URL
 * dataType: the datatype of the request - default is empty string
 * data: the data to send with the request - default is empty string
 * method: the method of the request e.g. PUT/POST/GET/DELETE
 * contentType: the contentType header
 * timeout: timeout until request expires
 * @returns {*}
 */
mCAP.Utils.request = function (settings) {

  var ajaxOptions = {
    data: settings.data || {t: new Date().getTime()}
  };

  if(ajaxOptions.data && (settings.type === 'POST' || settings.type === 'PUT')){
    ajaxOptions.data = JSON.stringify(ajaxOptions.data);
    ajaxOptions.contentType = 'application/json';
  }

  ajaxOptions = _.extend(settings,ajaxOptions);

  return Backbone.ajax(ajaxOptions);
};