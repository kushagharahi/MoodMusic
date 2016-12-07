// has list of lyrics, get lyrics through tone analyzer and store results and song information in db , postgre?

var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");


var tone_analyzer = new ToneAnalyzerV3({
  url: "https://gateway.watsonplatform.net/tone-analyzer/api",
  password: "password",
  username: "username",
  version_date: "2016-05-19"
});


var pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  database: 'lyrics', //env var: PGDATABASE
 //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

var text = "I miss the old Kanye, straight from the 'Go Kanye Chop up the soul Kanye, set on his goals Kanye I hate the new Kanye, the bad mood Kanye  The always rude Kanye, spaz in the news Kanye I miss the sweet Kanye, chop up the beats Kanye I gotta to say, at that time I'd like to meet Kanye See I invented Kanye, it wasn't any Kanyes And now I look and look around and there's so many Kanyes I used to love Kanye, I used to love Kanye I even had the pink Polo, I thought I was Kanye What if Kanye made a song, about Kanye?"
var title = 'I Love Kanye'
var artist = 'Kanye West'
var anger, fear,  disgust, joy, sadness
var max

var analyzeTone(text){
  tone_analyzer.tone({ text: text },
  function(err, tone) {
    if (err)
      console.log(err);
    else {
      //console.log(tone);
      anger = tone["document_tone"]["tone_categories"][0]["tones"][0]["score"]
      fear = tone["document_tone"]["tone_categories"][0]["tones"][1]["score"]
      disgust = tone["document_tone"]["tone_categories"][0]["tones"][2]["score"]
      joy = tone["document_tone"]["tone_categories"][0]["tones"][3]["score"]
      sadness = tone["document_tone"]["tone_categories"][0]["tones"][4]["score"]
      // console.log('Anger Score' );
      // console.log(tone["document_tone"]["tone_categories"][0]["tones"][0]["score"]); //anger
      // console.log('Fear Score:' );
      // console.log(tone["document_tone"]["tone_categories"][0]["tones"][1]["score"]); //fear
      // console.log('Disgust Score:' );
      // console.log(tone["document_tone"]["tone_categories"][0]["tones"][2]["score"]); //disgust
      // console.log('Joy Score:' );
      // console.log(tone["document_tone"]["tone_categories"][0]["tones"][3]["score"]); //joy
      // console.log('Sadness Score:' );
      // console.log(tone["document_tone"]["tone_categories"][0]["tones"][4]["score"]); //sadness
      //console.log(JSON.stringify(tone, null, 2));
      maximum = Math.max(anger, fear, disgust, joy, sadness)
      switch(maximum){
        case anger:
          max = 'anger';
        case fear:
          max = 'fear';
        case disgust:
          max = 'disgust';
        case joy:
          max = 'joy';
        case sadness:
          max = 'sadness';
      }

     }
});
}

var insertInfo = function(title, artist, anger, fear, disgust, joy, sadness, mostlikely){
  // to run a query we can acquire a client from the pool,
  // run a query on the client, and then return the client to the pool
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var queryText = 'INSERT INTO song_info(title, artist, anger, fear, disgust, joy, sadness, mostLikely) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
    client.query(queryText, [title, artist, anger, fear, disgust, joy, sadness, mostlikely], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }

    });
  });

  pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
  })
}

//get songs that surpass the emotion threshold, getting invalid numeric type?
var returnSongs = function(emotion){
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var queryText = 'SELECT title, artist FROM song_info WHERE (mostLikely = $1)'
    client.query(queryText, [emotion], function(err, result) {
      //call `done()` to release the client back to the pool
      console.log(result.rows[0].title);
      console.log(result.rows[0].artist);
      console.log(result);
      done();

      if(err) {
        return console.error('error running query', err);
      }

    });
  });

  pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
  })
}


analyzeTone(text)
insertInfo(title, artist,anger, fear, disgust, joy, sadness, max)
var emotion = 'sadness'
//returns songs given one emotion, but given one emotion, maybe return random possible ones
returnSongs(emotion)

/*
DATABASE CONTENTS:
song title, artist, anger, fear, disgust, joy, sadness
please parse to me: title and artist <3
*/
