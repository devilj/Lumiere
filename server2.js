var http = require('http');

var browserify = require('browserify');
var literalify = require('literalify');
var express = require('express');
var _ = require('lodash');
var parse = require('./parse.js');

var app = express();
app.use(require('body-parser').json());
app.use('/', express.static('app'));

app.get('/data', function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
});

app.get('/bundle.js', function(req, res) {
    res.setHeader('Content-Type', 'text/javascript');

    return browserify().add('./browser.js')
    .add('./browser.js')
    .transform(literalify.configure({
        'react': 'window.React',
        'react-dom': 'window.ReactDOM'
    }))
    .bundle()
    .pipe(res);

});


var server = app.listen(8090, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Lumiere backend listening at http://%s:%s', host, port);

});

app.get("/getdata", function(req, res) {

    return parse.getTrainData(function(result) {
        res.send(result);

    });
});



//tar --exclude='node_modules' --exclude=".git" --exlcude="bower_components" -cvf Lumiere.tar Lumiere/
