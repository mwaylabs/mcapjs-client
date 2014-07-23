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
    expect(Job.prototype.defaults.extras).toBeDefined();
    expect(Job.prototype.defaults.badge).toBeDefined();
    expect(typeof Job.prototype.sendPush).toEqual('function');

    var job = mCAP.push.jobs.add({});
    expect(mCAP.push.jobs.length).toEqual(1);
    expect(job.get('deviceFilter')).toEqual(null);
    expect(job.get('sound')).toEqual('');
    expect(job.get('message')).toEqual('');

    expect(job.sendPush().then).toBeDefined();
    expect(job.sendPush().fail).toBeDefined();
    expect(job.sendPush().always).toBeDefined();

    mCAP.push.jobs.remove(job);
    expect(mCAP.push.jobs.length).toEqual(0);
  });

  it("Jobs implementation", function(){

    var jobs = new mCAP.Jobs(null, {
      url: function(){
        return 'http://test.com';
      }
    });
    expect(jobs.length).toEqual(0);
    job = jobs.add({});
    expect(jobs.length).toEqual(1);

    expect(job.get('deviceFilter')).toEqual(null);
    expect(job.get('sound')).toEqual('');
    expect(job.get('message')).toEqual('');

    expect(job.sendPush().then).toBeDefined();
    expect(job.sendPush().fail).toBeDefined();
    expect(job.sendPush().always).toBeDefined();

    jobs.remove(job);
    expect(jobs.length).toEqual(0);

  });


  it("Jobs endpoint", function () {

    var baseUrl = 'http://www.mcap.com';
    mCAP.application.set('baseUrl', baseUrl);

    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/jobs');
    mCAP.push.set('uuid', '5854AE59-8642-4B05-BC71-72B76B4E81E8');
    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/jobs');
    mCAP.application.set('pushServiceApiVersion', 'v2');
    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/5854AE59-8642-4B05-BC71-72B76B4E81E8/jobs');
    mCAP.push.set('uuid', '');
    mCAP.application.set('pushServiceApiVersion', '');
    expect(mCAP.push.jobs.url()).toEqual(baseUrl + '/push/api/v1/apps/jobs');
  });

});