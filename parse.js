
var http = require('http');
var cheerio = require("cheerio");
var _ = require("lodash");


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

var data='';

var intervalID = setInterval(myCallback, 30000);

function myCallback() {
    // Set up the request
    var post_req = http.request(post_options, function(res) {

        //console.log('STATUS: ' + res.statusCode);
        //console.log('Response HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            console.log(chunk);
            data += chunk;
        });


        res.on('end', function () {
            // console.log('BODY: ' + chunk);
            var s1 = data.toString().replace(/\\r\\n/g,"");
            var s2 = s1.replace(/\\u003c/g,"<");
            var s3 = s2.replace(/\\u003e/g,">");
            var s4 = s3.replace(/\\">/g,"\">");
            var s5 = s4.replace(/\"}/g,"\"");
            //extract string that starts right after *SPLIT*
            response = s5.substr(s5.lastIndexOf("*SPLIT*") + 7, s4.length);
            //console.log(response);

            parseHtmlResponse(response);
        });
    });

    post_req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });


    // post the data
    post_req.write(post_data);
    post_req.end();

}




function parseHtmlResponse(response) {
    console.log("called AAA")
    var $ = cheerio.load(response);

    var result=[];
    var count = 0;
    var train={};

    $('p').each(function() {

        if (count == 6) {
            count = 0;
            train={};
        }

        switch(count) {

            case 0:
                train.time=$(this).text();
                break;
            case 1:
                train.to=$(this).text();
                break;
            case 2:
                train.track=$(this).text();
                break;
            case 3:
                train.line=$(this).text();
                break;
            case 4:
                train.train=$(this).text();
                break;
            case 5:
                train.status=$(this).text();
                result.push(_.clone(train));
        }

        count = count + 1;
    });

    console.log(result);

    return result;
}
