var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser());
app.use('/cssFiles', express.static(__dirname + '/assets/materialize/css'));

// app.get('/', function (req, res) {
//     res.sendFile('index.html', { root: path.join(__dirname + '/view') });
// })

app.get('/', function(req, res){
    res.sendFile('index.html', {root: path.join(__dirname + '/view')})
});

app.post('/', function(req, res){
    res.end(JSON.stringify(req.body));
})

app.listen(8888, function (req, res) {
    console.log('Server is starting...');
});