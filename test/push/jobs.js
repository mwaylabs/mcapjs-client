describe("mCAP.push.jobs", function () {

  it("Object definition: Jobs", function () {

    expect(Jobs).toBeDefined();

    expect(mCAP.push.jobs).toBeDefined();
    expect(mCAP.Collection.prototype.isPrototypeOf(mCAP.push.jobs)).toBeTruthy();
    expect(Backbone.Collection.prototype.isPrototypeOf(mCAP.push.jobs)).toBeTruthy();

  });

  it("Object definition: Job", function () {

    expect(Job).toBeDefined();
    expect(Job.prototype.defaults).toBeDefined();
    expect(Job.prototype.defaults.deviceFilter).toBeDefined();
    expect(Job.prototype.defaults.sound).toBeDefined();
    expect(Job.prototype.defaults.message).toBeDefined();

    var job = mCAP.push.jobs.add({});

    expect(job.get('deviceFilter')).toEqual(null);
    expect(job.get('sound')).toEqual('');
    expect(job.get('message')).toEqual('');

  });


  it("Jobs endpoint", function () {

    var baseUrl = 'http://www.mcap.com';
    mCAP.application.set('baseUrl', baseUrl);

    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/jobs');
    mCAP.application.set('pushService', '5854AE59-8642-4B05-BC71-72B76B4E81E8');
    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/jobs');
    mCAP.application.set('pushServiceApiVersion', 'v2');
    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/jobs');
    mCAP.application.set('pushService', '');
    mCAP.application.set('pushServiceApiVersion', '');
    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/jobs');

  });

});