var express = require('express');
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
var passport = require('passport');
var ejs = require("ejs");

var app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
console.log('뷰 엔진이 ejs로 설정되었습니다.');
app.engine("ejs", ejs.renderFile);
app.use(cookieParser())
app.use(session({
    secret: "abcdefg",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("assets"));
app.use(express.static("views"));

var router1 = require('./router/user_router')(app);

var server = app.listen(2000, function () {
    console.log('포트 2000번으로 서버 실행');
});