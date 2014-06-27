var BASE_URL  = 'https://example.com:8443/';
var USER = 'username';
var PASSWORD = 'password';

mCAP.application.set('baseUrl', BASE_URL);
mCAP.authentication.set('userName', USER);
mCAP.authentication.set('password', PASSWORD);

mCAP.authentication.login().then(function(){
    return mCAP.authentication.logout();
}).then(function(){
    return mCAP.authentication.isAuthenticated();
}).fail(function(){
    console.log('is not authenticated');
    mCAP.authentication.login().then(function(){
        return mCAP.authentication.isAuthenticated().then(function(){
            console.log('is authenticated');
        }).fail(function(){
            console.log('is not authenticated');
        });
    }).fail(function(){
        console.log('login err');
    });
});