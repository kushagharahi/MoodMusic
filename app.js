// has list of lyrics, get lyrics through tone analyzer and store results and song information in db , postgre?

var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");


var tone_analyzer = new ToneAnalyzerV3({
    url: "https://gateway.watsonplatform.net/tone-analyzer/api",
    password: "BrbAurNfTFTq",
    username: "5e1a4ef2-6da6-48f8-a15b-31955ae21b4b",
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


var analyzeTone = function(text) {
    return new Promise(function(fulfill, reject) {
            tone_analyzer.tone({
                text: text
            }, function(err, tone) {
                var emotions = [];
                if (err)
                    reject(err);
                else {
                    var max
                    var anger = tone["document_tone"]["tone_categories"][0]["tones"][0]["score"]
                    var fear = tone["document_tone"]["tone_categories"][0]["tones"][1]["score"]
                    var disgust = tone["document_tone"]["tone_categories"][0]["tones"][2]["score"]
                    var joy = tone["document_tone"]["tone_categories"][0]["tones"][3]["score"]
                    var sadness = tone["document_tone"]["tone_categories"][0]["tones"][4]["score"]
                    emotions.push(anger)
                    emotions.push(fear)
                    emotions.push(disgust)
                    emotions.push(joy)
                    emotions.push(sadness)
                    maximum = Math.max(anger, fear, disgust, joy, sadness)
                    switch (maximum) {
                        case anger:
                            max = 'anger';
                            break;
                        case fear:
                            max = 'fear';
                            break;
                        case disgust:
                            max = 'disgust';
                            break;
                        case joy:
                            max = 'joy';
                            break;
                        case sadness:
                            max = 'sadness';
                            break;
                    }
                    //return emotions
                    emotions.push(max)
                }
                fulfill(emotions);
            });
        });
    };



var insertInfo = function(title, artist, emotions){
  // to run a query we can acquire a client from the pool,
  // run a query on the client, and then return the client to the pool
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var queryText = 'UPDATE song_info SET anger=$1, fear=$2, disgust=$3, joy=$4, sadness=$5, mostLikely=$6 WHERE(artist = $7 and title = $8)'
    client.query(queryText, [emotions[0],emotions[1],emotions[2],emotions[3],emotions[4],emotions[5], artist, title], function(err, result) {
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

//SELECT ALL SONGS, for each row need to apply functions to get info
var selectSongs = function() {
    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        var queryText = 'SELECT title, artist, lyrics FROM song_info'
        client.query(queryText, function(err, result) {
            //call `done()` to release the client back to the pool
            // for(var i = 0; i < result.rows.length; i++){
            //   console.log(result.rows[i].title)
            // }
            // console.log(result.rows[0].title);
            // console.log(result.rows[0].artist);
            //console.log(result);
            //var emotions = analyzeTone(result.rows[0].lyrics)
            //console.log(emotions)
            // var rowCount = 0;
            result.rows.forEach(function(row) {
              analyzeTone(row.lyrics).then(function(emotions) {
                var title = row.title
                var artist = row.artist
                console.log(title + artist);
                console.log(emotions);
                insertInfo(title, artist, emotions)
              })
            })
            // for(var i = 0; i < result.rows.length; i++){
            //   var emotions = []
            //   analyzeTone(result.rows[i].lyrics).then(function(data) {
            //     var title = result.rows[i].title
            //     var artist = result.rows[i].artist
            //     emotions = data;
            //     console.log(title + artist);
            //     console.log(emotions);
            //     insertInfo(title, artist, emotions)
            //     if(i == (result.rows.length - 1)){
            //       done();
            //     }
            //   })
            // }
            //done();

            if (err) {
                return console.error('error running query', err);
            }

        });
    });

    pool.on('error', function(err, client) {
        // if an error is encountered by a client while it sits idle in the pool
        // the pool itself will emit an error event with both the error and
        // the client which emitted the original error
        // this is a rare occurrence but can happen if there is a network partition
        // between your application and the database, the database restarts, etc.
        // and so you might want to handle it and at least log it out
        console.error('idle client error', err.message, err.stack)
    })
}
selectSongs()
