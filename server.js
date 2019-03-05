var express = require('express');
var app = express();
var iotf = require('ibmiotf');
var appConfig;

var serverPort = process.env.PORT || 3000;

// parse out the VCAP_SERVICES environment variable to retrieve the credentials for the IoTF service.
if (process.env.VCAP_SERVICES) {
  var env = JSON.parse(process.env.VCAP_SERVICES);
  appConfig = {
    'org': env["iotf-service"][0].credentials.org,
    'id': 'rh-ibm-node-app',
    'auth-key': env["iotf-service"][0].credentials.apiKey,
    'auth-token': env["iotf-service"][0].credentials.apiToken
  }
} else {
  appConfig = require('./application.json');
}

var responseString = 'Hello Coursera';

var appClient = new iotf.IotfApplication(appConfig);
app.get('/', function (req, res) {
  res.send(responseString);
});

var server = app.listen(serverPort, function () {
  var port = server.address().port;
  console.log('Listening on port : %s', port);
  // connect to the IoTF service
  appClient.connect();

  // subscribe for device events
  appClient.on('connect', function () {
    appClient.subscribeToDeviceEvents();
  });

  // handle device events when they arrive
  appClient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
    responseString = "Device event at " + new Date().toString() + " from " + deviceType +
      ":" + deviceId + "; event = " + eventType + ", payload = " + payload;
  });
});