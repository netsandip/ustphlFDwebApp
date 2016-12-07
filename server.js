/**
 * Created by DELL on 4/22/2016.
 */

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var connection = require('./connection');
var favicon = require('serve-favicon');
var config = require('./config');
var cmd = require('node-cmd');
var exec = require('child_process').exec;


/*app.use(favicon(__dirname + '/public/images/favicon.ico'));*/
app.use(express.static(__dirname + '/public'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use(bodyparser.json());

var setTempValue =24;

mongoose.connect(connection.connectionString);

app.get('/getinfo',function(req,res){

    Info.find(function (err, docs) {
        if (err) return console.error(err);
        res.json(docs);
    });
});


var Port = process.env.PORT || 3000;
app.listen(Port);
console.log("server running on port " + Port);