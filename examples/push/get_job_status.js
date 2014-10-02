// get all push jobs

mCAP.push.jobs.fetch().then(function(){
  if(mCAP.push.jobs.models[0]){
    mCAP.push.jobs.models[0].fetch().then(function(data){
      log('job object: ', JSON.stringify(data, null, 3));
      log('job status: ' + mCAP.push.jobs.models[0].get('state'));
    });
  }

});