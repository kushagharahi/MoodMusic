'use strict';

var pg = require('pg');

// instantiate a new client
// the client will read connection information from
// the same environment variables used by postgres cli tools

// Queries for different situations
var queries = {
  well: `SELECT title, artist FROM song_info WHERE mostlikely = 'joy' 
    OR mostlikely = 'anger' OR mostlikely = 'disgust' 
    ORDER BY random() LIMIT 5`,
  unwell: `SELECT title, artist FROM song_info WHERE mostlikely = 'sadness'
    OR mostlikely = 'fear' ORDER BY random() LIMIT 5`,
  neutral: `SELECT title, artist FROM song_info ORDER BY random() LIMIT 5`
};
var config = {
  database: 'moodmusic'
};

function querySongs(mood) {
  return new Promise(function(fulfill, reject) {
    var client = new pg.Client(config);
    client.connect(function(err) {
      if (err) reject(err);

      // Execute query
      client.query(queries[mood], function(err, result) {
        var songs = [];
        for (let row of result.rows) {
          songs.push({
            title: row.title,
            artist: row.artist
          });
        }

        // Disconnect the client
        client.end((err) => {if (err) reject(err)});
        fulfill(songs);
      });
    });
  });
}

// Public access functions
module.exports = {
  querySongs: querySongs
};
