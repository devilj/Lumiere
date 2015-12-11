
var jsdom = require("jsdom");
var http = require('http');
var htmlparser = require("htmlparser");
var cheerio = require("cheerio");

//
var post_options = {
    host: 'passcomm.njtransit.com',
    port: 80,
    path: '/webdisplay/WebDisplay.asmx/Display2',
    method: 'POST',
    headers: {
        'Host': 'passcomm.njtransit.com',
        'Origin': 'http://passcomm.njtransit.com',
        'Referer': 'http://passcomm.njtransit.com/webdisplay/tid.aspx?SID=US',
        'Content-Type': 'application/json; charset=UTF-8'
    }
};

var post_data = JSON.stringify({
    'station_id' : 'US',
    'platform': '',
    'status': '',
    'rfont' : '',
    'order' : '',
    'allowblanking' : '',
     'agency' : '',
     'browser' : 'Chrome',
     'useragent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/47.0.2526.73 Chrome/47.0.2526.73 Safari/537.36"'
});

// Set up the request
var post_req = http.request(post_options, function(res) {

    //console.log('STATUS: ' + res.statusCode);
    //console.log('Response HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
       // console.log('BODY: ' + chunk);
        var s1 = chunk.toString().replace(/\\r\\n/g,"");
        var s2 = s1.replace(/\\u003c/g,"<");
        var s3 = s2.replace(/\\u003e/g,">");
        var s4 = s3.replace(/\\">/g,"\">");
        var s5 = s4.replace(/\"}/g,"\"");
        //extract string that starts right after *SPLIT*
        response = s5.substr(s5.lastIndexOf("*SPLIT*") + 7, s4.length);
        console.log(response);

        parseHtmlResponse(response);
    });
});

post_req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});


// post the data
post_req.write(post_data);
post_req.end();


function parseHtmlResponse(response) {


    //jsdom.env(
    //    response,
    //    ["http://code.jquery.com/jquery.js"],
    //    function (err, window) {
    //        console.log(err);
    //        var $ = window.$;
    //
    //        console.log("there have been", $("td").length, "io.js releases!");
    //    }
    //);

    //var handler = new htmlparser.DefaultHandler(function (error, dom) {
    //    if (error)
    //        console.log("Error");
    //    else
    //        console.log("No error");
    //});
    //var parser = new htmlparser.Parser(handler);
    //parser.parseComplete(response);
    //console.log(handler.dom, false, null);

    var $ = cheerio.load(response);
    var list = $("td");

    console.log(list.html());
}
