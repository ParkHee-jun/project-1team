var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mysql = require("mysql2");
var express = require('express');
var session = require("express-session");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bkdf2Password = require("pbkdf2-password");
var crypto = require('crypto');
var hasher = bkdf2Password();

var conn_info = {
    host: "localhost",
    port: 3306,
    user: "user",
    password: "1234",
    database: "CobwebDB"
}

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("user_index.ejs");
    });

    app.get('/login', function (req, res) {
        res.render('user_login');
    });

    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });

    // app.post('/login', function (req, res) {
    //     var id = req.body.user_id;
    //     var pwd = req.body.user_pwd;
    //     var conn = mysql.createConnection(conn_info);
    //     var sql = 'SELECT * FROM db_member WHERE user_id=?';
    //     conn.query(sql, [id], function (err, results) {
    //         if (err)
    //             console.log(err);

    //         if (!results[0])
    //             return res.render('login');

    //         var user = results[0];
    //         crypto.pbkdf2(pwd, user.salt, 100000, 64, 'sha512', function (err, derivedKey) {
    //             if (err)
    //                 console.log(err);
    //             if (derivedKey.toString('hex') === user.user_pwd) {
    //                 req.session.name = user.user_name;
    //                 req.session.save(function () {
    //                     return res.redirect('/profile');
    //                 });
    //             } else {
    //                 return res.send('login');
    //             }
    //         });//pbkdf2
    //     });//query
    // });

    passport.use(new LocalStrategy(
        function (user_name, user_pwd, done) {
            var sql = 'SELECT * FROM db_member WHERE user_id=?';
            var conn = mysql.createConnection(conn_info);
            conn.query(sql, [user_name], function (err, results) {
                if (err)
                    return done(err);
                if (!results[0])
                    return done('please check your id.');

                var user = results[0];
                crypto.pbkdf2(user_pwd, user.salt, 100000, 64, 'sha512', function (err, derivedKey) {
                    if (err)
                        return done(err);

                    if (derivedKey.toString('hex') === user.user_pwd)
                        return done(null, user);
                    else
                        return done('please check your password.');
                });//pbkdf2
            });//query
        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user.user_id);
    });
    passport.deserializeUser(function (id, done) {
        var sql = 'SELECT * FROM db_member WHERE user_id=?';
        var conn = mysql.createConnection(conn_info);
        conn.query(sql, [id], function (err, results) {
            if (err)
                return done(err, false);
            if (!results[0])
                return done(err, false);

            return done(null, results[0]);
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/login',
        passport.authenticate(
            'local',
            {
                successRedirect: '/user_profile',
                failureRedirect: '/user_login',
                failureFlash: false
            })
    );


    // app.post("/login", urlencodedParser, function (req, res) {
    //     var user_id = req.body.user_id;
    //     var user_pwd = req.body.user_pwd;
    //     var conn = mysql.createConnection(conn_info);
    //     conn.query('SELECT * FROM db_member WHERE user_id = ?', [user_id],
    //         function (error, results, fields) {
    //             if (error) {
    //                 // console.log("error ocurred", error);
    //                 res.send({
    //                     "code": 400,
    //                     "failed": "error ocurred"
    //                 });
    //             } else {
    //                 // console.log('The solution is: ', results);
    //                 if (results.length > 0) {
    //                     if (results[0].user_pwd == user_pwd) {
    //                         res.redirect("/user_profile", render_data);
    //                     } else {
    //                         res.send({
    //                             "code": 204,
    //                             "success": "ID and password does not match"
    //                         });
    //                     }
    //                 } else {
    //                     res.send({
    //                         "code": 204,
    //                         "success": "ID does not exists"
    //                     });
    //                 }
    //             }
    //         });
    // });
    app.get("/profile", function (req, res) {
        var user_id = req.session.user_id;
        var user_name = req.session.user_name;
        var user_pwd = req.session.user_pwd;
        var conn = mysql.createConnection(conn_info);
        var sql = "select from db_member user_name, user_id, user_pwd"

        conn.query(sql, function (err, rows) {
            var render_data = {
                id: user_id,
                name: user_name,
                pwd: user_pwd
            }

            res.render("user_profile", render_data);
        });
    });

    // app.post("/register", urlencodedParser, function (req, res) {
    //     var user_name = req.body.user_name;
    //     var user_id = req.body.user_id;
    //     var user_pwd = req.body.user_pwd;

    //     var conn = mysql.createConnection(conn_info);
    //     var sql = "insert into db_member(user_name, " + " user_id, " + " user_pwd) values(? , ? , ?)";
    //     var input_data = [user_name, user_id, user_pwd];
    //     console.log(sql);
    //     console.log(input_data);

    //     conn.query(sql, input_data, function (err) {
    //         if (err) {
    //             console.log(err);
    //         }
    //         conn.end();
    //         res.redirect("user_login");
    //     });
    // });
    app.get("/user_login", function (req, res) {
        res.render("user_login.ejs");
    });
    app.get("/user_index", function (req, res) {
        res.render("user_index.ejs");
    });
    app.get("/user_trade", function (req, res) {
        res.render("user_trade.ejs");
    });
    app.get("/user_wallet", function (req, res) {
        res.render("user_wallet.ejs");
    });
    app.get("/user_profile", function (req, res) {
        res.render("user_profile.ejs");
    });
    app.get("/user_dashboard", function (req, res) {
        res.render("user_dashboard.ejs");
    });
    app.get("/user_register", function (req, res) {
        res.render("user_register.ejs");
    });
    app.get("/user_deposit", function (req, res) {
        res.render("user_deposit.ejs");
    });
    app.get("/user_withdrawals", function (req, res) {
        res.render("user_withdrawals.ejs");
    });
}

// //===== MySQL 데이터베이스를 사용할 수 있는 mysql 모듈 불러오기 =====//
// var mysql = require('mysql2');

// //===== MySQL 데이터베이스 연결 설정 =====//
// var pool = mysql.createPool({
//     host: 'localhost',
//     port: 3306,
//     user: "user",
//     password: '1234',
//     database: 'CobwebDB',
//     debug: false
// });



// // 사용자를 등록하는 함수
// var addUser = function (id, name, password, phone, address, callback) {
//     console.log('addUser 호출됨.');

//     // 커넥션 풀에서 연결 객체를 가져옵니다.
//     pool.getConnection(function (err, conn) {
//         if (err) {
//             if (conn) {
//                 conn.release(); // 반드시 해제해야 합니다.
//             }

//             callback(err, null);
//             return;
//         }
//         console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

//         // 데이터를 객체로 만듭니다.
//         var date = { user_id: id, user_name: name, user_pwd: password, user_phone: phone, user_address: address };

//         //SQL문을 실행합니다.
//         var exec = conn.query('insert into users set ?', data, function (err, result) {
//             conn.release(); // 반드시 해제해야 합니다.
//             console.log('실행 대상 SQL : ', +exec.sql);

//             if (err) {
//                 console.log('SQL 실행 시 오류 발생함.');
//                 console.dir(err);

//                 callback(err, null);

//                 return;
//             }

//             callback(null, result);
//         });
//     });
// };

// //사용자 추가 라우팅 함수
// router.route('/register').post(function (req, res) {
//     console.log('/register 호출됨.');

//     var user_id = req.body.user_id || req.query.user_id;
//     var user_pwd = req.body.user_pwd || req.query.user_pwd;
//     var user_name = req.body.user_name || req.query.user_name;
//     // var paramAge = req.body.user_phone || req.query.user_phone;

//     console.log('요청 파라미터 : ' + user_id + ',' + user_pwd + ',' + user_name + ',');

//     // pool 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
//     if (pool) {
//         addUser(user_id, user_name, user_pwd, function (err, addedUser) {
//             // 동일한 id로 추가할 때 오류 발생 - 클라이언트로 오류 전송
//             if (err) {
//                 console.error('사용자 추가 중 오류 발생 : ' + err.stack);

//                 res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
//                 res.write('<h2>사용자 추가 중 오류 발생</h2>');
//                 res.write('<p>' + err.stack + '</p>');
//                 res.end();

//                 return;
//             }

//             // 결과 객체 있으면 성공 응답 전송
//             if (addedUser) {
//                 console.dir(addeuUser);

//                 console.log('inserted' + addedUser.affectedRows + 'rows');

//                 var insertId = addedUser.insertId;
//                 console.log('추가한 레코드의 아이디 : ' + insertId);

//                 res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
//                 res.write('<h2>사용자 추가 성공</h2>');
//                 res.end();
//             } else {
//                 res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
//                 res.write('<h2>사용자 추가 실패</h2>');
//                 res.end();
//             }
//         });
//     } else { // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
//         res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
//         res.write('<h2>데이터베이스 연결 실패</h2>');
//         res.end();
//     }
// });

// // 사용자를 인증하는 함수
// var authUser = function (id, password, callback) {
//     console.log('authUser 호출됨.');

//     // 커넥션 풀에서 연결 객체를 가져옵니다
//     pool.getConnection(function (err, conn) {
//         if (err) {
//             if (conn) {
//                 conn.release(); // 반드시 해제해야 합니다.
//             }
//             callback(err, null);
//             return;
//         }
//         console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

//         var columns = ['user_id', 'user_name', 'user_pwd'];
//         var tablename = 'users';

//         // SQL문을 실행합니다.
//         var exec = conn.query("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password], function (err, rows) {
//             conn.release(); // 반드시 해제해야 합니다.
//             console.log('실행 대상 SQL : ' + exec.sql);

//             if (rows.length > 0) {
//                 console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
//                 callback(null, rows);
//             } else {
//                 console.log("일치하는 사용자를 찾지 못함.");
//                 callback(null, null);
//             }
//         });
//     });
// };

// // 로그인 처리 함수
// router.route('/login').post(function (req, res) {
//     console.log('/login 호출됨.');

//     // 요청 파라미터 확인
//     var user_id = req.body.user_id || req.query.user_id;
//     var user_pwd = req.body.user_pwd || req.query.user_pwd;

//     console.log('요청 파라미터 : ' + user_id + ',' + user_pwd);

//     // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
//     if (pool) {
//         authUser(user_id, user_pwd, function (err, rows) {
//             //오류가 발생했을 때 클라이언트로 오류 전송
//             if (err) {
//                 console.error('사용자 로그인 중 오류 발생 : ' + err.stack);
//                 res.writeHead('200', { 'Content-Type': 'text/htaml;charse=utf8' });
//                 res.write('<h2>사용자 로그인 중 오류 발생</h2>');
//                 res.write('<p>' + err.stack + '</p>');
//                 res.end();
//                 return;
//             }

//             if (rows) {
//                 console.dir(rows);

//                 var username = rows[0].name;

//                 res.writeHead('200', { 'Content-Type': 'text/htaml;charse=utf8' });
//                 res.write('<h1>로그인 성공</h1>');
//                 res.write('<div><p>사용자 아이디 : ' + user_id + '</p></div>');
//                 res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
//                 res.write("<br><br><a href='/views/user_login.ejs'>다시 로그인하기</a>");
//                 res.end();
//             }
//         });
//     };
// });
