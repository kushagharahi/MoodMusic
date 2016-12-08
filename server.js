'use strict';

// Access environment variables to get credential information
require('dotenv').config({silent: true});

var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');
var db = require('./db/query.js');

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
    var returnSongs = function(songs) {
      var outputText = data.output.text[0];
      var songOutput = '';
      for (let song of songs) 
        songOutput += `<br>${song.title} - ${song.artist}`;
      // Concat the extra info
      outputText += songOutput;
      // Modify the response's output
      data.output.text[0] = outputText;
      res.json(data);
    };

    if (err) {
      console.log(JSON.stringify(err, null, 2));
      res.status(err.code || 500).json(err);
    }
    else {
      // Query and alter Watson's response if it's a music request
      if (data.intents[0]) {
        // console.log(data.intents[0].intent);
        if (data.intents[0].intent === 'request') {
          if (data.entities[0]) {
            switch (data.entities[0].value) {
              case 'well':
                db.querySongs('well').then(returnSongs);
                console.log("Well");
                break;
              case 'unwell':
                db.querySongs('unwell').then(returnSongs);
                console.log("Unwell");
                break;
              case 'neutral':
                db.querySongs('neutral').then(returnSongs);
                console.log("Neutral");
                break;
              default: // Huh?
                data.output.text[0] = "I'm sorry I don't understand :(";
                res.json(data);
            }
          }
        }
        else if (data.intents[0].intent === 'yes') {
          switch (data.context.yes_mood) {
            case 'well':
              db.querySongs('well').then(returnSongs);
              console.log("Well");
              break;
            case 'unwell':
              db.querySongs('unwell').then(returnSongs);
              console.log("Unwell");
              break;
            case 'neutral':
              db.querySongs('neutral').then(returnSongs);
              console.log("Neutral");
              break;
            case 'none':
              // Do nothing
              res.json(data);
              console.log("None");
              break;
            default: //Huh?
              data.output.text[0] = "I'm sorry I don't understand :(";
              res.json(data);
          }
        } else res.json(data);
      } else res.json(data);
    }
  });

}).listen(port, function() {
  console.log('Listen on port %d', port);
});

