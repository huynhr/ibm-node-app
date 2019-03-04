var express = require("express");
var app = express();

var serverPort = process.env.VCAP_APP_PORT || 3000;
var serverHost = process.env.VCAP_APP_HOST || 'localhost';

app.get('/', function (req, res) {
  res.send('Hello Coursera');
});

var server = app.listen(serverPort, serverHost, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});