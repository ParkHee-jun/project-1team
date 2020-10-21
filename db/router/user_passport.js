var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended:false});
var mysql = require("mysql2");

var conn_info = {
    host : "localhost",
    port : 3306,
    user : "user",
    password : "1234",
    database : "CobwebDB"
}

module.exports = function (router, passport) {
    console.log('user_passport 호출됨.');

    // 홈 화면 - index.ejs 템플릿으로 홈 화면이 보이도록 함
    router.route('/').get(function (req, res) {
        console.log('/ 패스 요청됨.');
        res.render('user_index.ejs');
    });

    // 로그인 화면
    router.route('/login').get(function (req, res) {
        console.log('/login 패스 요청됨.');
        res.render('user_login.ejs', { message: req.flash('loginMessage') });
    });
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // 회원가입 화면
    router.route('/register').get(function (req, res) {
        console.log('/register 패스 요청됨.');
        res.render('user_register.ejs', { message: req.flash('signupMessage') });
    });
    router.route('/register').post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/register',
        failureFlash: true
    }));

    // 프로필 화면 - 로그인 여부를 확인할 수 있도록 먼저 isLoggedIn 미들웨어 실행
    router.route('/profile').get(function (req, res) {
        console.log('/profile 패스 요청됨.');

        // 인증된 경우 req.user 객체에 사용자 정보 있으며, 인증이 안 된 경우 req.user는 false 값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증이 안 된 경우
        if (!req.user) {
            console.log('사용자 인증이 안 된 상태임.');
            res.redirect('/');
            return;
        }

        // 인증된 경우
        console.log('사용자 인증된 상태임');
        if (Array.isArray(req.user)) {
            res.render('user_profile.ejs', { user: req.user[0]._doc });
        } else {
            res.render('user_profile.ejs', { user: req.user });
        }
    });

    // 로그아웃
    router.route('/logout').get(function (req, res) {
        console.log('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });
    router.route("/user_login").get(function(req,res){
        res.render("user_login.ejs");
    });
    router.route("/user_dashboard").get(function(req,res){
        res.render("user_dashboard.ejs");
    });
    router.route("/user_index").get(function(req,res){
        res.render("user_index.ejs");
    });
    router.route("/user_profile").get(function(req,res){
        res.render("user_profile.ejs");
    });
    router.route("/user_register").get(function(req,res){
        res.render("user_register.ejs");
    });
    router.route("/user_trade").get(function(req,res){
        res.render("user_trade.ejs");
    });
    router.route("/user_wallet").get(function(req,res){
        res.render("user_wallet.ejs");
    });
}