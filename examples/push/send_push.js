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

mCAP.authentication.login().then(function () {
  return job.sendPush().then(function () {
    log('Send a push message with device Filter');
  });
});

// Sends a push message to all registered devices
var job2 = mCAP.push.jobs.add({
  "message": "Hello Android",
  "sound": "nameOfSound.wav",
  "badge": "2",
  "extras": {
    "myHidden": "Attribute"
  }
});

mCAP.authentication.login().then(function () {
  return job2.sendPush().then(function () {
    log('Send a push message to all registered devices');
  });
});