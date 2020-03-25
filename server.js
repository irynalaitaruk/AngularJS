const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const port = 8000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));


//MYSQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1pirogyk',
    database: 'confectionery',
    port: 8000
});

// create table CAKES
let initDb = function () {
    connection.query('' +
        'CREATE TABLE IF NOT EXISTS cakes (' +
        'id int(11) NOT NULL AUTO_INCREMENT,' +
        'name varchar(50), ' +
        'themecake_id int(11),' +
        'PRIMARY KEY(id), ' +
        'UNIQUE INDEX `name_UNIQUE` (`name` ASC))',
        function (err) {
            if (err) throw err;
            console.log('CREATE TABLE IF NOT EXISTS cakes')
        });
};

initDb();
// create table BABYCHRISTEN
let initDb1 = function () {
    connection.query('' +
        'CREATE TABLE IF NOT EXISTS babychristen (' +
        'id int(11) NOT NULL AUTO_INCREMENT,' +
        'name varchar(50), ' +
        'image varchar(50),' +
        'PRIMARY KEY(id), ' +
        'UNIQUE INDEX `name_UNIQUE` (`name` ASC))',
        function (err) {
            if (err) throw err;
            console.log('CREATE TABLE IF NOT EXISTS babychristen')
        });
};

initDb1();
//// create table THEMECAKE
//let initDb2 = function () {
//    connection.query('' +
//        'CREATE TABLE IF NOT EXISTS themecake (' +
//        'id int(11) NOT NULL AUTO_INCREMENT,' +
//        'name varchar(50), ' +
//        'PRIMARY KEY(id), ' +
//        'UNIQUE INDEX `name_UNIQUE` (`name` ASC))',
//        function (err) {
//            if (err) throw err;
//            console.log('CREATE TABLE IF NOT EXISTS themecake')
//        });
//};
//
//initDb2();


//get items
app.get('/cakes', function (req, res) {
connection.query('SELECT * FROM cakes', 
    function (err,rows) {
        if (err) throw err;
    console.log('get all cakes,length: ' + rows.length);

res.status(200).send(rows);
    });
});

//get items2
app.get('/babychristen', function (req, res) {
connection.query('SELECT * FROM babychristen', 
    function (err,rows) {
        if (err) throw err;
    console.log('get all babychristen,length: ' + rows.length);

res.status(200).send(rows);
    });
});
////get bag brand
//app.post('/themecake-inf', function (req, res) {
//    connection.query('SELECT * FROM themecake  WHERE name = ?', req.body.name, function (err, rows) {
//        if (err) throw err;
//        if (rows[0] != undefined) {
//             connection.query('SELECT * FROM cakes  WHERE themecake_id = ?', rows[0].id,
//                function (err, result) {
//                    if (err) throw err;
//                    res.status(200).send(result);
//                }
//            );
//        } else {
//            res.status(200).send("Themecake is undefined");
//        }
//    });
//});




//Усі адреси контролюються клієнтським ангуляром
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


app.listen(port, function (err) {
    if (err) throw err;
    console.log('Server start on port 8000!');
});