var http = require("http");
var cheerio = require('cheerio');
var fs =  require('fs');
var parse = require('csv-parse');
var async = require('async');

function pageContents(artist, songTitle) {  
    var content = "";
    var options = {
        host: "www.azlyrics.com",
        port: 80,
        path: "/lyrics/" + artist + "/" + songTitle + ".html"
    };
    var headers = { 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    'Content-Type' : 'application/x-www-form-urlencoded' 
};
    var request = http.request(options, function(res) {
        res.headers = headers;
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            content += chunk;
        });

        res.on("end", function () {
            console.log(content);
            scapeLyrics(content, artist, songTitle);
        });
    });

    request.end();
} 


function scapeLyrics(htmlContent, artist, songTitle) {
    var $ = cheerio.load(htmlContent);
    console.log(artist + " " + songTitle);
    //var allDivs = $('div').contains("<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->"); 
    var filteredDivs = $('div').filter(function(i, el) {
          return Object.keys($(this)[0].attribs).length === 0;
    });
    var filePath = "./lyrics/"+artist+"-"+songTitle+".txt";
    fs.open(filePath, 'w', function(err){
        if(err)
            console.log(err);
        else {
            fs.writeFile(filePath, filteredDivs.text(), function(err){
                if(err)
                    return console.log(err);
            });
        }    
        });
    
    console.log(filteredDivs.text());
}

readSpotifyGlobalCSV();

function readSpotifyGlobalCSV() {
   var csvPath = "./regional-global-daily-latest.csv";
   var parser = parse({delimiter: ','}, function (err, data) {
//    async.eachSeries(data, function (line, callback) {
//        // do something with the line
//        console.log(processSongName(line[1]));
//        console.log(processArtistName(line[2]));
//        pageContents(processArtistName(line[2]), processSongName(line[1]));
//        callback();
//  })
    async.eachSeries(data, function(line, callback){
        setTimeout(function(){
              pageContents(processArtistName(line[2]).toLowerCase(), processSongName(line[1]).toLowerCase());
              callback();
        }, 5000);
       
    });
});
fs.createReadStream(csvPath).pipe(parser);
}

function processArtistName(artistName){
    if(artistName.toLowerCase().includes("the ")){
        artistName = artistName.toLowerCase().split("the ")[1];
    }
    artistName = artistName.replace(/[^0-9a-z]/gi, '');
    return artistName;
}

function processSongName(songName){
    if(songName.includes('(')) //remove everything after first '('
    {
        songName = songName.split('(')[0];
    }
    if(songName.includes('-')) //remove everything after first -
    {
        songName = songName.split('-')[0];
    }
    songName = songName.replace(/[^0-9a-z]/gi, '');//remove all non alphanumeric
    return songName;
}