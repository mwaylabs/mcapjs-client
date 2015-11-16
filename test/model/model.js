describe("mCAP Model", function () {

  it("Object", function () {


    expect(mCAP.Model).toBeDefined();
    expect(typeof mCAP.Model).toBe('function');

    expect(Backbone.Model.prototype.isPrototypeOf(mCAP.Model.prototype)).toBeTruthy();
    var testModel = new mCAP.Model();
    expect(Backbone.Model.prototype.isPrototypeOf(testModel)).toBeTruthy();
    testModel = null;

  });


  it("Properties ", function () {

    expect(mCAP.Model.prototype.hasOwnProperty('idAttribute')).toBeTruthy();
    expect(mCAP.Model.prototype.hasOwnProperty('selectable')).toBeTruthy();
    expect(mCAP.Model.prototype.hasOwnProperty('selectableOptions')).toBeTruthy();
    expect(mCAP.Model.prototype.hasOwnProperty('constructor')).toBeTruthy();
    expect(mCAP.Model.prototype.hasOwnProperty('setEndpoint')).toBeTruthy();
    expect(mCAP.Model.prototype.hasOwnProperty('parse')).toBeTruthy();
  });


  it("Instance ", function () {

    var a = new mCAP.Model({});
    var b = new mCAP.Model({});
    expect(a.hasOwnProperty('idAttribute')).toBeFalsy();
    expect(a.hasOwnProperty('selectable')).toBeTruthy();
    expect(a.hasOwnProperty('selectableOptions')).toBeFalsy();
    expect(a.hasOwnProperty('constructor')).toBeFalsy();
    expect(a.hasOwnProperty('setEndpoint')).toBeFalsy();
    expect(a.hasOwnProperty('parse')).toBeFalsy();

    expect(b.hasOwnProperty('idAttribute')).toBeFalsy();
    expect(b.hasOwnProperty('selectable')).toBeTruthy();
    expect(b.hasOwnProperty('selectableOptions')).toBeFalsy();
    expect(b.hasOwnProperty('constructor')).toBeFalsy();
    expect(b.hasOwnProperty('setEndpoint')).toBeFalsy();
    expect(b.hasOwnProperty('parse')).toBeFalsy();
  });


  it("Selectable ", function () {

    var NotSelectable = mCAP.Model.extend({
      selectable: false
    });

    var NotSelectableString = mCAP.Model.extend({
      selectable: ""
    });

    var notSelectable = new NotSelectable();
    expect(notSelectable.hasOwnProperty('selectable')).toBeFalsy();
    expect(notSelectable.selectable).toBeFalsy();
    expect(ModelSelectable.prototype.isPrototypeOf(notSelectable.selectable)).toBeFalsy();
    notSelectable = new NotSelectableString();
    expect(notSelectable.hasOwnProperty('selectable')).toBeFalsy();
    expect(notSelectable.selectable).toBeFalsy();
    expect(ModelSelectable.prototype.isPrototypeOf(notSelectable.selectable)).toBeFalsy();


    var Selectable = mCAP.Model.extend({
    });

    var selectable = new Selectable();
    expect(selectable.hasOwnProperty('selectable')).toBeTruthy();
    expect(ModelSelectable.prototype.isPrototypeOf(selectable.selectable)).toBeTruthy();

  });

  it("Endpoint ", function () {

    // cache the baseUrl
    var applicationBaseUrl = mCAP.application.get('baseUrl');

    expect(mCAP.Model.prototype.hasOwnProperty('endpoint')).toBeFalsy();

    var enpointValue = '';

    var Endpoint = mCAP.Model.extend({
      endpoint: enpointValue
    });

    var endppoint = new Endpoint();
    expect(Endpoint.prototype.hasOwnProperty('endpoint')).toBeTruthy();
    expect(endppoint.endpoint).toEqual(enpointValue);
    expect(endppoint.hasOwnProperty('urlRoot')).toBeTruthy();
    expect(typeof endppoint.urlRoot).toEqual('function');
    expect(endppoint.urlRoot()).toEqual(mCAP.application.get('baseUrl') + '/' + enpointValue);

    // set the endpoint after model init
    var Asset = mCAP.Model.extend({
      endpoint: 'asset'
    });
    var asset = new Asset();
    mCAP.application.set('baseUrl', 'http://www.mcap1.de/');
    expect(asset.url()).toEqual('http://www.mcap1.de/asset');

    // set the endpoint before model init
    var Asset = mCAP.Model.extend({
      endpoint: 'asset'
    });
    mCAP.application.set('baseUrl', 'http://www.mcap2.de/');
    var asset = new Asset();
    expect(asset.url()).toEqual('http://www.mcap2.de/asset');

    // set the endpoint before model extend
    mCAP.application.set('baseUrl', 'http://www.mcap3.de/');
    var Asset = mCAP.Model.extend({
      endpoint: 'asset'
    });
    var asset = new Asset();
    expect(asset.url()).toEqual('http://www.mcap3.de/asset');

    // refert the basUrl
    mCAP.application.set('baseUrl', applicationBaseUrl);

  });

  it("BaseUrl has slash", function () {

    // cache the baseUrl
    var applicationBaseUrl = mCAP.application.get('baseUrl');

    // set the endpoint after model init
    var Asset = mCAP.Model.extend({
      endpoint: 'asset'
    });
    var asset = new Asset();
    mCAP.application.set('baseUrl', 'http://www.mcap1.de');
    expect(asset.url()).toEqual('http://www.mcap1.de/asset');

    // set the endpoint before model init
    var Asset = mCAP.Model.extend({
      endpoint: 'asset'
    });
    mCAP.application.set('baseUrl', 'http://www.mcap2.de');
    var asset = new Asset();
    expect(asset.url()).toEqual('http://www.mcap2.de/asset');

    // set the endpoint before model extend
    mCAP.application.set('baseUrl', 'http://www.mcap3.de');
    var Asset = mCAP.Model.extend({
      endpoint: 'asset'
    });
    var asset = new Asset();
    expect(asset.url()).toEqual('http://www.mcap3.de/asset');

    // refert the basUrl
    mCAP.application.set('baseUrl', applicationBaseUrl);

  });

  it("Endpoint has slash", function () {

    // cache the baseUrl
    var applicationBaseUrl = mCAP.application.get('baseUrl');

    // set the endpoint after model init
    var Asset = mCAP.Model.extend({
      endpoint: '/asset'
    });
    var asset = new Asset();
    mCAP.application.set('baseUrl', 'http://www.mcap1.de');
    expect(asset.url()).toEqual('http://www.mcap1.de/asset');

    // set the endpoint before model init
    var Asset = mCAP.Model.extend({
      endpoint: '/asset'
    });
    mCAP.application.set('baseUrl', 'http://www.mcap2.de');
    var asset = new Asset();
    expect(asset.url()).toEqual('http://www.mcap2.de/asset');

    // set the endpoint before model extend
    mCAP.application.set('baseUrl', 'http://www.mcap3.de');
    var Asset = mCAP.Model.extend({
      endpoint: '/asset'
    });
    var asset = new Asset();
    expect(asset.url()).toEqual('http://www.mcap3.de/asset');

    // refert the basUrl
    mCAP.application.set('baseUrl', applicationBaseUrl);

  });

  it("Endpoint + BaseUrl has slash", function () {

    // cache the baseUrl
    var applicationBaseUrl = mCAP.application.get('baseUrl');

    // set the endpoint after model init
    var Asset = mCAP.Model.extend({
      endpoint: '/asset'
    });
    var asset = new Asset();
    mCAP.application.set('baseUrl', 'http://www.mcap1.de/');
    expect(asset.url()).toEqual('http://www.mcap1.de/asset');

    // set the endpoint before model init
    var Asset = mCAP.Model.extend({
      endpoint: '/asset'
    });
    mCAP.application.set('baseUrl', 'http://www.mcap2.de/');
    var asset = new Asset();
    expect(asset.url()).toEqual('http://www.mcap2.de/asset');

    // set the endpoint before model extend
    mCAP.application.set('baseUrl', 'http://www.mcap3.de/');
    var Asset = mCAP.Model.extend({
      endpoint: '/asset'
    });
    var asset = new Asset();
    expect(asset.url()).toEqual('http://www.mcap3.de/asset');

    // refert the basUrl
    mCAP.application.set('baseUrl', applicationBaseUrl);

  });

  it("parse", function () {
    var model = new mCAP.Model();

    var parse1 = {};
    var parse2 = null;
    var parse3 = 1;
    var parse4 = -1;
    var parse5 = 0;
    var parse6 = 2;
    var parse7 = undefined;
    var parse8 = '';
    var parse9 = true;
    var parse10 = false;
    var parse11 = [];

    expect(model.parse()).toEqual(void 0);
    expect(model.parse(parse1)).toEqual(parse1);
    expect(model.parse(parse2)).toEqual(parse2);
    expect(model.parse(parse3)).toEqual(parse3);
    expect(model.parse(parse4)).toEqual(parse4);
    expect(model.parse(parse5)).toEqual(parse5);
    expect(model.parse(parse6)).toEqual(parse6);
    expect(model.parse(parse7)).toEqual(parse7);
    expect(model.parse(parse8)).toEqual(parse8);
    expect(model.parse(parse9)).toEqual(parse9);
    expect(model.parse(parse10)).toEqual(parse10);
    expect(model.parse(parse11)).toEqual(parse11);

    var parse1_2 = {results: parse1};
    var parse2_2 = {results: parse2};
    var parse3_2 = {results: parse3};
    var parse4_2 = {results: parse4};
    var parse5_2 = {results: parse5};
    var parse6_2 = {results: parse6};
    var parse7_2 = {results: parse7};
    var parse8_2 = {results: parse8};
    var parse9_2 = {results: parse9};
    var parse10_2 = {results: parse10};
    var parse11_2 = {results: parse11};

    expect(model.parse()).toEqual(void 0);
    expect(model.parse(parse1_2)).toEqual(parse1_2);
    expect(model.parse(parse2_2)).toEqual(parse2_2);
    expect(model.parse(parse3_2)).toEqual(parse3_2);
    expect(model.parse(parse4_2)).toEqual(parse4_2);
    expect(model.parse(parse5_2)).toEqual(parse5_2);
    expect(model.parse(parse6_2)).toEqual(parse6_2);
    expect(model.parse(parse7_2)).toEqual(parse7_2);
    expect(model.parse(parse8_2)).toEqual(parse8_2);
    expect(model.parse(parse9_2)).toEqual(parse9_2);
    expect(model.parse(parse10_2)).toEqual(parse10_2);
    expect(model.parse(parse11_2)).toEqual(parse11_2);


    var parse1_1 = {data: parse1_2};
    var parse2_1 = {data: parse2_2};
    var parse3_1 = {data: parse3_2};
    var parse4_1 = {data: parse4_2};
    var parse5_1 = {data: parse5_2};
    var parse6_1 = {data: parse6_2};
    var parse7_1 = {data: parse7_2};
    var parse8_1 = {data: parse8_2};
    var parse9_1 = {data: parse9_2};
    var parse10_1 = {data: parse10_2};
    var parse11_1 = {data: parse11_2};

    expect(model.parse()).toEqual(void 0);
    expect(model.parse(parse1_1)).toEqual(parse1_1.data);
    expect(model.parse(parse2_1)).toEqual(parse2_1.data);
    expect(model.parse(parse3_1)).toEqual(parse3_1.data);
    expect(model.parse(parse4_1)).toEqual(parse4_1.data);
    expect(model.parse(parse5_1)).toEqual(parse5_1.data);
    expect(model.parse(parse6_1)).toEqual(parse6_1.data);
    expect(model.parse(parse7_1)).toEqual(parse7_1.data);
    expect(model.parse(parse8_1)).toEqual(parse8_1.data);
    expect(model.parse(parse9_1)).toEqual(parse9_1.data);
    expect(model.parse(parse10_1)).toEqual(parse10_1.data);
    expect(model.parse(parse11_1)).toEqual(parse11_1.data);

    expect(model.parse({data: {results: [parse1]}})).toEqual(parse1);
    expect(model.parse({data: {results: [parse2]}})).toEqual(parse2);
    expect(model.parse({data: {results: [parse3]}})).toEqual(parse3);
    expect(model.parse({data: {results: [parse4]}})).toEqual(parse4);
    expect(model.parse({data: {results: [parse5]}})).toEqual(parse5);
    expect(model.parse({data: {results: [parse6]}})).toEqual(parse6);
    expect(model.parse({data: {results: [parse7]}})).toEqual({results: [parse7]});
    expect(model.parse({data: {results: [parse8]}})).toEqual(parse8);
    expect(model.parse({data: {results: [parse9]}})).toEqual(parse9);
    expect(model.parse({data: {results: [parse10]}})).toEqual(parse10);
    expect(model.parse({data: {results: [parse11]}})).toEqual(parse11);

  });

});