// get registered tags

mCAP.push.tags.fetch().then(function(){
  log('got registered tags', JSON.stringify(mCAP.push.tags.tags, null, 3));
});