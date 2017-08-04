var express = require('express');
var path = require('path');
var app = express();
var router = express.Router();
var route = express.Router();

app.use('/mhs', router);
app.use('/users', route);

app.use('/cssFiles', express.static((__dirname + '/assets/materialize/css')));
app.use('/jsFiles', express.static(__dirname + '/assets/materialize/js'));

route.get('/:username?', function(req, res){
    res.end(JSON.stringify(req.params));
});

router.get('/first', function(req, res){
    res.end('first');
});

router.get('/second', function(req, res){
    res.end('second');
});

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: path.join(__dirname + '/view')});
});

app.get('/home', function(req, res){
    res.sendFile('home.html', {root: path.join(__dirname + '/view')});
})


app.listen(8888, function (req, res) {
    console.log('Server is starting..');
});