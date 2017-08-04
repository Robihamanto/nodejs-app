var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var mysql = require('mysql');
var view = require('swig');
var morgan = require('morgan');
var bcrypt = require('bcrypt');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node',
});

// var routes = require('./routes/index');

var app = express();

var session;

//Security
app.disable('x-powered-by');

//Using
app.use('/cssFiles', express.static(__dirname + '/assets/materialize/css'));
app.use('/jsFiles', express.static(__dirname + '/assets/materialize/js'));
app.use('/fontFiles', express.static(__dirname + '/assets/materialize/fonts'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(sessions({
    secret: 'robihamanto',
    resave: false,
    saveUninitialized: false,
}));

//Route
app.get('/', function (req, res) {
    session = req.session;
    if (session.uniqueID) {
        res.redirect('/redirect');
    }
    var html = view.compileFile('./view/index.html')({
        name: 'Robihamanto',
    });
    res.end(html);
});

app.post('/', function (req, res) {
    //Checking Session
    session = req.session;
    if (session.uniqueID) {
        res.redirect('/redirect');
    }

    //Looking for data in mahasiswa database
    connection.query('SELECT * FROM MAHASISWA WHERE ?', {
        nim: req.body.username,
    }, function (err, rows, fields) {
        if (err) throw error;
        if (bcrypt.compareSync(req.body.password, rows[0].password)) {
            // session.uniqueID = rows[0].nama;
            session.uniqueID = rows;
            console.log(session.uniqueID);
        }
        res.redirect('/redirect');
    });
    
});

app.get('/redirect', function (req, res) {
    session = req.session;
    if (session.uniqueID) {
        res.redirect('/home');
    } else {
        res.redirect('/');
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.get('/home', function (req, res) {
    // session = req.session;
    // if (session.uniqueID) {
    var html = view.compileFile('./view/home.html')({
        // name: session.uniqueID,
    });
    res.end(html);
    // } else {
        // res.redirect('/');
    // }
});

app.get('/admin', function (req, res) {
    if (session.uniqueID == 'admin') {
        res.sendFile('admin.html', { root: __dirname + '/view' });
    } else {
        res.redirect('/');
    }
});


app.get('/listMahasiswa', function (req, res) {
    // connection.query('SELECT * FROM MAHASISWA WHERE ? AND ?',[
    //     {nim: '145150207111067'},
    //     {nama: 'robihamanto'}], function(err, rows, fields){
    //     if(err) throw error;
    //     console.log(rows);
    // });

    connection.query('SELECT * FROM MAHASISWA', function (err, rows, fields) {
        if (err) throw error;
        var user = rows;
    });
    console.log(user);
    // console.log(user[0].nama);
    // console.log(user[0].password);

    var validate = [{
        username: req.body.username,
        password: req.body.password,
    }];

    console.log(validate);
});

app.get('/list', function (req, res) {
    var html = view.compileFile('./view/mahasiswa.html')({
        name: 'Mahasiswa',
    });
    res.end(html);
});

app.get('/register', function (req, res) {
    //Checking Session
    session = req.session;
    if (session.uniqueID) {
        res.redirect('/redirect');
    }

    res.sendFile('register.html', { root: __dirname + '/view' });
})

app.post('/register', function (req, res) {
    //Checking Session
    session = req.session;
    if (session.uniqueID) {
        res.redirect('/redirect');
    }

    connection.query('INSERT INTO MAHASISWA SET ?', {
        nim: req.body.nim,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        nama: req.body.name,
    });
    res.redirect('/');
})

app.listen(8888, function (req, res) {
    console.log('Server is starting..');
});