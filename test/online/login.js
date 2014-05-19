describe("mCap.authentication", function () {

  var mCapApplicationAttributes, mCapAuthenticationAttributes, server, callback, loginResponseDataSucc, serverSuccCallback;

  mCapApplicationAttributes = JSON.stringify(mCap.application.attributes);
  mCapAuthenticationAttributes = JSON.stringify(mCap.authentication.attributes);

  beforeEach(function () {
    mCap.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');

    mCap.application.attributes = JSON.parse(mCapApplicationAttributes);
    mCap.authentication.attributes = JSON.parse(mCapAuthenticationAttributes);

  });

  afterEach(function () {
    // reset the baseurl
    mCap.application.attributes = JSON.parse(mCapApplicationAttributes);
    mCap.authentication.attributes = JSON.parse(mCapAuthenticationAttributes);
  });


  it("Login config with set authentication successful", function (done) {
    mCap.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');
    mCap.authentication.set('username', USERNAME);
    mCap.authentication.set('organization', ORGANIZATION);
    mCap.authentication.set('password', PASSWORD);

    mCap.authentication.login().then(function () {
      expect(mCap.authentication.get('username')).toBe(USERNAME);
      expect(mCap.authentication.get('organization')).toBe(ORGANIZATION);
      expect(mCap.authentication.get('password')).toBe(PASSWORD);
      done();
    });

  });

  it("Login fail", function (done) {
    mCap.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');

    mCap.authentication.login().fail(function () {
      expect(mCap.authentication.get('username')).toBe('');
      expect(mCap.authentication.get('organization')).toBe('');
      expect(mCap.authentication.get('password')).toBe('');
      done();
    });
  });

  it("Login with string param", function (done) {
    mCap.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');
    mCap.authentication.set('username', USERNAME);
    mCap.authentication.set('organization', ORGANIZATION);
    mCap.authentication.login(PASSWORD).then(function () {
      expect(mCap.authentication.get('username')).toBe(USERNAME);
      expect(mCap.authentication.get('organization')).toBe(ORGANIZATION);
      expect(mCap.authentication.get('password')).toBe('');
      done();
    });
  });

  it("Login obj string param", function (done) {
    mCap.application.set('baseUrl', 'http://coredev4.mwaysolutions.com');
    mCap.authentication.set('username', '');
    mCap.authentication.set('organization', '');
    mCap.authentication.login({
      username: USERNAME,
      password: PASSWORD,
      organization: ORGANIZATION
    }).then(function () {
      expect(mCap.authentication.get('username')).toBe(USERNAME);
      expect(mCap.authentication.get('organization')).toBe(ORGANIZATION);
      expect(mCap.authentication.get('password')).toBe(PASSWORD);
      done();
    });
  });

  xit("Workflow: Login - Business - Logout", function (done) {

    mCap.application.set('baseUrl', 'https://coredev4.mwaysolutions.com');

    mCap.authentication.set('username', USERNAME);
    mCap.authentication.set('organization', ORGANIZATION);
    mCap.authentication.set('password', PASSWORD);


    var Assets = Backbone.Collection.extend({
      url: function(){
        return mCap.application.get('baseUrl') + '/gofer/asset/rest/assets'
      }
    });
    var assets = new Assets();

    mCap.authentication.login().then(function(){
      assets.fetch().then(function(){
        mCap.authentication.logout().then(function(){
          done();
        });
      });
    });


  });

  xit("Workflow: Login - Business - Logout - Login - Business - Logout", function (done) {

    mCap.application.set('baseUrl', 'https://coredev4.mwaysolutions.com');

    mCap.authentication.set('username', USERNAME);
    mCap.authentication.set('organization', ORGANIZATION);
    mCap.authentication.set('password', PASSWORD);


    var Assets = Backbone.Collection.extend({
      url: function(){
        return mCap.application.get('baseUrl') + '/gofer/asset/rest/assets'
      }
    });
    var assets = new Assets();

    mCap.authentication.login().then(function(){
      assets.fetch().then(function(){
        mCap.authentication.logout().then(function(){
          mCap.authentication.login().then(function(){
            assets.fetch().then(function(){
              mCap.authentication.logout().then(function(){
                done();
              });
            });
          });
        });
      });
    });


  });

  it("Workflow: Login - Business - Logout - Login - Business - Logout with logout workaround", function (done) {

    mCap.application.set('baseUrl', 'https://coredev4.mwaysolutions.com');

    mCap.authentication.set('username', USERNAME);
    mCap.authentication.set('organization', ORGANIZATION);
    mCap.authentication.set('password', PASSWORD);


    var Assets = Backbone.Collection.extend({
      url: function(){
        return mCap.application.get('baseUrl') + '/gofer/asset/rest/assets'
      }
    });
    var assets = new Assets();

    mCap.authentication.login().then(function(){
      assets.fetch().then(function(){
        // logout returns not a valid json therefor use always
        mCap.authentication.logout().always(function(){
          mCap.authentication.login().then(function(){
            assets.fetch().then(function(){
              // logout returns not a valid json therefor use always
              mCap.authentication.logout().always(function(){
                done();
              });
            });
          });
        });
      });
    });


  }, 40000);

});





















