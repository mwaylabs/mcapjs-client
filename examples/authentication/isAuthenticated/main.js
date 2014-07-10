// the server url
var BASE_URL  = '<host>';
// the username
var USER = '<user>';
// the password
var PASSWORD = '<pass>';
// first configure the base URL
mCAP.application.set('baseUrl', BASE_URL);
// then configure the authentication
mCAP.authentication.set('userName', USER);
// you don't have to store the password. It is also possible to give it as parameter to the login
mCAP.authentication.set('password', PASSWORD);

// perform a login
mCAP.authentication.login().then(function(){
  // after succ login perform a logout
    return mCAP.authentication.logout();
}).then(function(){
 // check the authentication state
    return mCAP.authentication.isAuthenticated();
}).fail(function(){
  // login failed
    log('is not authenticated');
  // login again
    mCAP.authentication.login().then(function(){
      // check the authentication state
        return mCAP.authentication.isAuthenticated().then(function(){
            log('is authenticated');
        }).fail(function(){
            log('is not authenticated');
        });
    }).fail(function(){
        log('login err');
    });
});