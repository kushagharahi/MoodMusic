'use strict';

var pg = require('pg');

// instantiate a new client
// the client will read connection information from
// the same environment variables used by postgres cli tools

// Queries for different situations
var queries = {
  well: `SELECT title, artist FROM song_info WHERE most_likely = 'joy' 
    OR most_likely = 'anger' OR most_likely = 'disgust' 
    ORDER BY random() LIMIT 2`,
  unwell: `SELECT title, artist FROM song_info WHERE most_likely = 'sadness'
    OR most_likely = 'fear' ORDER BY random() LIMIT 2`,
  neutral: `SELECT title, artist FROM song_info ORDER BY random() LIMIT 2`
};
var config = {
  database: 'moodmusic'
};

// var client = new pg.Client(config);

// Connect to client
// client.connect(function(err) {
//   if (err) throw err;
//
//   // Execute a query
//   client.query(queries.well, function(err, result) {
//     if (err) throw err;
//     for (let row of result.rows) 
//       console.log(row.title);
//
//     client.end(function(err) {
//       if (err) throw err;
//     });
//   });
// });

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
