var express = require('express');
var ejs = require("ejs");
var cookieParser = require("cookie-parser");
var session = require("express-session");

var app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);
app.use(cookieParser())
app.use(session({
    secret : "abcdefg",
    resave : false,
    saveUninitialized : true
}));

app.use(express.static("assets"));
app.use(express.static("views"));


var router1 = require('./router/user_router')(app);

var server = app.listen(2000, function(){
    console.log('포트 2000번으로 서버 실행');
});