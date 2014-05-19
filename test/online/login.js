describe("mCAP.authentication", function () {

  var mCAPApplicationAttributes, mCAPAuthenticationAttributes, server, callback, loginResponseDataSucc, serverSuccCallback;

  mCAPApplicationAttributes = JSON.stringify(mCAP.application.attributes);
  mCAPAuthenticationAttributes = JSON.stringify(mCAP.authentication.attributes);

  beforeEach(function () {
    mCAP.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');

    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);

  });

  afterEach(function () {
    // reset the baseurl
    mCAP.application.attributes = JSON.parse(mCAPApplicationAttributes);
    mCAP.authentication.attributes = JSON.parse(mCAPAuthenticationAttributes);
  });


  it("Login config with set authentication successful", function (done) {
    mCAP.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');
    mCAP.authentication.set('username', USERNAME);
    mCAP.authentication.set('organization', ORGANIZATION);
    mCAP.authentication.set('password', PASSWORD);

    mCAP.authentication.login().then(function () {
      expect(mCAP.authentication.get('username')).toBe(USERNAME);
      expect(mCAP.authentication.get('organization')).toBe(ORGANIZATION);
      expect(mCAP.authentication.get('password')).toBe(PASSWORD);
      done();
    });

  });

  it("Login fail", function (done) {
    mCAP.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');

    mCAP.authentication.login().fail(function () {
      expect(mCAP.authentication.get('username')).toBe('');
      expect(mCAP.authentication.get('organization')).toBe('');
      expect(mCAP.authentication.get('password')).toBe('');
      done();
    });
  });

  it("Login with string param", function (done) {
    mCAP.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');
    mCAP.authentication.set('username', USERNAME);
    mCAP.authentication.set('organization', ORGANIZATION);
    mCAP.authentication.login(PASSWORD).then(function () {
      expect(mCAP.authentication.get('username')).toBe(USERNAME);
      expect(mCAP.authentication.get('organization')).toBe(ORGANIZATION);
      expect(mCAP.authentication.get('password')).toBe('');
      done();
    });
  });

  it("Login obj string param", function (done) {
    mCAP.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');
    mCAP.authentication.set('username', '');
    mCAP.authentication.set('organization', '');
    mCAP.authentication.login({
      username: USERNAME,
      password: PASSWORD,
      organization: ORGANIZATION
    }).then(function () {
      expect(mCAP.authentication.get('username')).toBe(USERNAME);
      expect(mCAP.authentication.get('organization')).toBe(ORGANIZATION);
      expect(mCAP.authentication.get('password')).toBe(PASSWORD);
      done();
    });
  });

  xit("Workflow: Login - Business - Logout", function (done) {

    mCAP.application.set('baseUrl', 'https://coredev4.mwaysolutions.com');

    mCAP.authentication.set('username', USERNAME);
    mCAP.authentication.set('organization', ORGANIZATION);
    mCAP.authentication.set('password', PASSWORD);


    var Assets = Backbone.Collection.extend({
      url: function(){
        return mCAP.application.get('baseUrl') + '/gofer/asset/rest/assets'
      }
    });
    var assets = new Assets();

    mCAP.authentication.login().then(function(){
      assets.fetch().then(function(){
        mCAP.authentication.logout().then(function(){
          done();
        });
      });
    });


  });

  xit("Workflow: Login - Business - Logout - Login - Business - Logout", function (done) {

    mCAP.application.set('baseUrl', 'https://coredev4.mwaysolutions.com');

    mCAP.authentication.set('username', USERNAME);
    mCAP.authentication.set('organization', ORGANIZATION);
    mCAP.authentication.set('password', PASSWORD);


    var Assets = Backbone.Collection.extend({
      url: function(){
        return mCAP.application.get('baseUrl') + '/gofer/asset/rest/assets'
      }
    });
    var assets = new Assets();

    mCAP.authentication.login().then(function(){
      assets.fetch().then(function(){
        mCAP.authentication.logout().then(function(){
          mCAP.authentication.login().then(function(){
            assets.fetch().then(function(){
              mCAP.authentication.logout().then(function(){
                done();
              });
            });
          });
        });
      });
    });


  });

  it("Workflow: Login - Business - Logout - Login - Business - Logout with logout workaround", function (done) {

    mCAP.application.set('baseUrl', 'https://coredev4.mwaysolutions.com');

    mCAP.authentication.set('username', USERNAME);
    mCAP.authentication.set('organization', ORGANIZATION);
    mCAP.authentication.set('password', PASSWORD);


    var Assets = Backbone.Collection.extend({
      url: function(){
        return mCAP.application.get('baseUrl') + '/gofer/asset/rest/assets'
      }
    });
    var assets = new Assets();

    mCAP.authentication.login().then(function(){
      assets.fetch().then(function(){
        // logout returns not a valid json therefor use always
        mCAP.authentication.logout().always(function(){
          mCAP.authentication.login().then(function(){
            assets.fetch().then(function(){
              // logout returns not a valid json therefor use always
              mCAP.authentication.logout().always(function(){
                done();
              });
            });
          });
        });
      });
    });


  }, 40000);

});





















