'use strict';

// Access environment variables to get credential information
require('dotenv').config({silent: true});

var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');

// Serve static UI files
app.use(express.static('public'));
// Populate request body to JSON
app.use(bodyParser.json());

// Watson Conversation instance
var conversation = watson.conversation({
  username: process.env.CONVERSATION_USERNAME || '<username>',
  password: process.env.CONVERSATION_PASSWORD || '<password>',
  version: 'v1',
  version_date: '2016-09-20'
});

//TODO: This is only testing
app.post('/connection/message', function(req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === 'workspace-id') {
    return res.json({
      output: {
        text: 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: {}, 
    input: {}
  };

  if (req.body) {
    if (req.body.input)
      payload.input = req.body.input;
    if (req.body.context)
      payload.context = req.body.context;
  }
  
  // Interact with Watson 
  conversation.message(payload, function(err, data) {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
      res.status(err.code || 500).json(err);
    }
    else {
      res.json(data);
    }
  })
}).listen(port, function() {
  console.log('Listen on port %d', port);
});

