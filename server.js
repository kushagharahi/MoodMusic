'use strict';

// Access environment variables to get credential information
require('dotenv').config({silent: true});

var port = 3000;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Serve static UI files
app.use(express.static('public'));
// Populate request body to JSON
app.use(bodyParser.json());

//TODO: This is only testing
app.post('/connection/message', function(req, res) {
  if (req.body) {
    console.log(req.body);
    res.send(req.body);
  }
  else res.send('{"error": "Request is blank."}')
}).listen(port, function() {
  console.log('Listen on port %d', port);
});

