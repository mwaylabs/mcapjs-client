describe("mCAP.PushNotification", function () {
  it("Object definition: PushNotification", function () {

    expect(mCAP.PushNotification).toBeDefined();
    expect(mCAP.PushNotification.prototype).toBeDefined();

    expect(typeof mCAP.PushNotification).toEqual('function');

    expect(mCAP.PushNotification.prototype.pushApp).toBeDefined();

  });

  it("Instance", function () {

    var pushNotification = new mCAP.PushNotification();

    expect(pushNotification.pushApp).toBeDefined();
    expect(mCAP.PushApp.prototype.isPrototypeOf(pushNotification.pushApp)).toBeTruthy();

  });

  it("function overview", function () {

    expect(mCAP.PushNotification.prototype.sendStatusBarNotification).toBeDefined();
    expect(mCAP.PushNotification.prototype.showToastNotification).toBeDefined();
    expect(mCAP.PushNotification.prototype.subscribeTag).toBeDefined();
    expect(mCAP.PushNotification.prototype.subscribeTags).toBeDefined();
    expect(mCAP.PushNotification.prototype.putAttributeValue).toBeDefined();
    expect(mCAP.PushNotification.prototype.removeAttribute).toBeDefined();
    expect(mCAP.PushNotification.prototype.setAttributes).toBeDefined();
    expect(mCAP.PushNotification.prototype.setCountry).toBeDefined();
    expect(mCAP.PushNotification.prototype.setCurrentBadge).toBeDefined();
    expect(mCAP.PushNotification.prototype.setToken).toBeDefined();
    expect(mCAP.PushNotification.prototype.setLanguage).toBeDefined();
    expect(mCAP.PushNotification.prototype.setModel).toBeDefined();
    expect(mCAP.PushNotification.prototype.setUser).toBeDefined();
    expect(mCAP.PushNotification.prototype.unsubscribeTag).toBeDefined();
    expect(mCAP.PushNotification.prototype.unregister).toBeDefined();

    expect(mCAP.PushNotification.prototype.set).toBeDefined();
    expect(mCAP.PushNotification.prototype.get).toBeDefined();

    expect(mCAP.PushNotification.prototype.getConfiguration).toBeDefined();

  });


  it("getter and setter from push app", function () {

    var pushNotification = new mCAP.PushNotification();

    expect(pushNotification.set('pushServiceId', 'pushServiceId').get('pushServiceId')).toEqual('pushServiceId');
    expect(pushNotification.getConfiguration()).toBeDefined();
    expect(pushNotification.getConfiguration().uuid).toBeDefined();
    expect(pushNotification.getConfiguration().name).toBeDefined();
    expect(pushNotification.getConfiguration().apnsProvider).toBeDefined();
    expect(pushNotification.getConfiguration().gcmProvider).toBeDefined();
    expect(pushNotification.getConfiguration().version).toBeDefined();
    expect(pushNotification.getConfiguration().effectivePermissions).toBeDefined();

  });

  it("constructor", function () {

    var pushNotification = new mCAP.PushNotification({
      pushServiceId: '123456',
      providerType: '',
      user: '',
      vendor: '',
      name: '',
      osVersion: '',
      language: '',
      country: '',
      badge: '',
      appPackageName: '',
      type: '',
      appVersion: '',
      model: '',
      token: ''
    });

    expect(pushNotification.get('pushServiceId')).toEqual('123456');
    expect(pushNotification.get('providerType')).toEqual('');
    expect(pushNotification.get('user')).toEqual('');
    expect(pushNotification.get('vendor')).toEqual('');
    expect(pushNotification.get('name')).toEqual('');
    expect(pushNotification.get('osVersion')).toEqual('');
    expect(pushNotification.get('language')).toEqual('');
    expect(pushNotification.get('country')).toEqual('');
    expect(pushNotification.get('tags')).toEqual([]);
    expect(pushNotification.get('badge')).toEqual('');
    expect(pushNotification.get('appPackageName')).toEqual('');
    expect(pushNotification.get('type')).toEqual('');
    expect(pushNotification.get('appVersion')).toEqual('');
    expect(pushNotification.get('model')).toEqual('');
    expect(pushNotification.get('attributes')).toEqual({});
    expect(pushNotification.get('token')).toEqual('');

    pushNotification = new mCAP.PushNotification({
      providerType: '',
      user: '',
      vendor: '',
      name: '',
      osVersion: '',
      language: '',
      country: '',
      badge: '',
      appPackageName: '',
      type: '',
      appVersion: '',
      model: '',
      token: '',
      attributes: {
        title: 'title'
      },
      tags: ['sports', 'politics']
    });

    expect(pushNotification.get('pushServiceId')).toEqual(null);
    expect(pushNotification.get('providerType')).toEqual('');
    expect(pushNotification.get('user')).toEqual('');
    expect(pushNotification.get('vendor')).toEqual('');
    expect(pushNotification.get('name')).toEqual('');
    expect(pushNotification.get('osVersion')).toEqual('');
    expect(pushNotification.get('language')).toEqual('');
    expect(pushNotification.get('country')).toEqual('');
    expect(pushNotification.get('tags')).toEqual(['sports', 'politics']);
    expect(pushNotification.get('badge')).toEqual('');
    expect(pushNotification.get('appPackageName')).toEqual('');
    expect(pushNotification.get('type')).toEqual('');
    expect(pushNotification.get('appVersion')).toEqual('');
    expect(pushNotification.get('model')).toEqual('');
    expect(pushNotification.get('attributes')).toEqual({
      title: 'title'
    });
    expect(pushNotification.get('token')).toEqual('');

  });

  it("getter and setter from device", function () {

    // From device
    var pushNotification = new mCAP.PushNotification();

    expect(pushNotification.set('providerType', 'providerType').get('providerType')).toEqual('providerType');
    expect(pushNotification.set('user', 'user').get('user')).toEqual('user');
    expect(pushNotification.set('vendor', 'vendor').get('vendor')).toEqual('vendor');
    expect(pushNotification.set('name', 'name').get('name')).toEqual('name');
    expect(pushNotification.set('osVersion', 'osVersion').get('osVersion')).toEqual('osVersion');
    expect(pushNotification.set('language', 'language').get('language')).toEqual('language');
    expect(pushNotification.set('country', 'country').get('country')).toEqual('country');
    expect(pushNotification.set('tags', ['tags']).get('tags')).toEqual(['tags']);
    expect(pushNotification.set('badge', 'badge').get('badge')).toEqual('badge');
    expect(pushNotification.set('appPackageName', 'appPackageName').get('appPackageName')).toEqual('appPackageName');
    expect(pushNotification.set('type', 'type').get('type')).toEqual('type');
    expect(pushNotification.set('appVersion', 'appVersion').get('appVersion')).toEqual('appVersion');
    expect(pushNotification.set('model', 'model').get('model')).toEqual('model');
    expect(pushNotification.set('attributes', {title: 'title'}).get('attributes')).toEqual({title: 'title'});
    expect(pushNotification.set('token', 'token').get('token')).toEqual('token');

    expect(pushNotification.addAttribute).toBeDefined();
    expect(pushNotification.removeAttribute).toBeDefined();
    expect(pushNotification.addTag).toBeDefined();
    expect(pushNotification.removeTag).toBeDefined();

    expect(pushNotification.set('attributes', {}).get('attributes')).toEqual({});
    expect(pushNotification.addAttribute('extra', 'xxx')).toBeDefined();
    expect(pushNotification.get('attributes')).toEqual({extra: 'xxx'});
    expect(pushNotification.removeAttribute).toBeDefined();
    expect(pushNotification.removeAttribute('extra')).toEqual(pushNotification);
    expect(pushNotification.get('attributes')).toEqual({});


    expect(pushNotification.set('tags', []).get('tags')).toEqual([]);
    expect(pushNotification.addTag).toBeDefined();
    expect(pushNotification.addTag('sports')).toEqual(pushNotification);
    expect(pushNotification.removeTag).toBeDefined();
    expect(pushNotification.removeTag('sports')).toEqual(pushNotification);
    expect(pushNotification.get('tags')).toEqual([]);

  });

  it("add a tag/tags", function () {

    var pushNotification = new mCAP.PushNotification();
    expect(pushNotification.get('tags').length).toEqual(0);
    pushNotification.addTag('a');
    expect(pushNotification.get('tags').length).toEqual(1);
    pushNotification.addTag('a');
    expect(pushNotification.get('tags').length).toEqual(1);
    pushNotification.addTag('a');
    expect(pushNotification.get('tags').length).toEqual(1);

    pushNotification.addTags(['a','a','a','a','a']);
    expect(pushNotification.get('tags').length).toEqual(1);

  });

  it("remove a tag/tags", function () {

    var pushNotification = new mCAP.PushNotification();
    pushNotification.addTag('a');
    pushNotification.addTag('b');
    pushNotification.addTag('c');
    expect(pushNotification.get('tags').length).toEqual(3);
    pushNotification.removeTag('a');
    expect(pushNotification.get('tags').length).toEqual(2);
    pushNotification.removeTag('b');
    expect(pushNotification.get('tags').length).toEqual(1);
    pushNotification.removeTag('c');
    expect(pushNotification.get('tags').length).toEqual(0);

    pushNotification.addTags(['a','b','c','d','e']);
    expect(pushNotification.get('tags').length).toEqual(5);
    pushNotification.removeTags(['a','b','c','d','e']);
    expect(pushNotification.get('tags').length).toEqual(0);


  });

});