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
    url: settings.url,
    dataType: settings.dataType || '',
    data: settings.data || {t: new Date().getTime()}
  };

  if (settings.method) {
    ajaxOptions.method = settings.method;
  }

  if (settings.contentType) {
    ajaxOptions.contentType = settings.contentType;
  }

  if (settings.timeout) {
    ajaxOptions.timeout = settings.timeout;
  }

  return $.ajax(ajaxOptions);
};