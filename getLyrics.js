var http = require("http");
var cheerio = require('cheerio');
var fs =  require('fs');

var content = "";

function pageContents(artist, songTitle) {

    var options = {
        host: "www.azlyrics.com",
        port: 80,
        path: "/lyrics/" + artist + "/" + songTitle + ".html"
    };
    var request = http.request(options, function(res) {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            content += chunk;
        });

        res.on("end", function () {
            scapeLyrics(content, artist, songTitle);
        });
    });

    request.end();
} 


function scapeLyrics(htmlContent, artist, songTitle) {
    var $ = cheerio.load(htmlContent);
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

pageContents("kanyewest", "ilovekanye");