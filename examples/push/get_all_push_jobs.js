// get all push jobs

mCAP.push.jobs.fetch().then(function(){
  log('get those push jobs: ', JSON.stringify(mCAP.push.jobs, null, 3));
});