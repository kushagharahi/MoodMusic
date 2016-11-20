var http = require("http");
var cheerio = require('cheerio');

var options = {
    host: "www.azlyrics.com",
    port: 80,
    path: "/lyrics/kanyewest/ilovekanye.html"
};

var content = "";

var pageContents = http.request(options, function(res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
        content += chunk;
    });

    res.on("end", function () {
        //console.log(content);
        scapeLyrics(content);
    });
});


function scapeLyrics(htmlContent) {
    var $ = cheerio.load(htmlContent);
    //var allDivs = $('div').contains("<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->"); 
    var filteredDivs = $('div').filter(function(i, el) {
          return Object.keys($(this)[0].attribs).length === 0;
    });

    console.log(filteredDivs.text());
}

pageContents.end();