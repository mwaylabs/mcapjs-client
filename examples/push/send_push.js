// Sends a push message with device Filter
var job = mCAP.push.jobs.add({
  "message": "Hallo Filter",
  "sound": "nameOfSound.wav",
  "deviceFilter": {
    "type": "logOp",
    "operation": "OR",
    "filters": [
      {
        "type": "stringEnum",
        "fieldName": "tags",
        "values": [
          "ledme"
        ]
      },
      {
        "type": "string",
        "fieldName": "uuid",
        "value": "B77448E2-E316-4889-8B57-464B1952D77"
      }
    ]
  },
  "badge": "2",
  "extras": {
    "myHidden": "Attribute"
  }
});
log('job created:', JSON.stringify(job, null, 3));

job.sendPush().then(function(){
  log('push send');
});