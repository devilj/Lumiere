var http = require('http');

var browserify = require('browserify');
var literalify = require('literalify');
var express = require('express');
var _ = require('lodash');

var app = express();
app.use(require('body-parser').json());
app.use('/', express.static('app'));

app.get('/data', function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
});

app.get('/bundle.js', function(req, res) {
    res.setHeader('Content-Type', 'text/javascript')

    browserify()
        .add('./browser.js')
        .transform(literalify.configure({
            'react': 'window.React',
            'react-dom': 'window.ReactDOM'
        }))
        .bundle()
        .pipe(res)
});


var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Lumiere backend listening at http://%s:%s', host, port);
});

