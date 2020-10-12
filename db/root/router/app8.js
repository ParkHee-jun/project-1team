//===== MySQL 데이터베이스를 사용할 수 있는 mysql 모듈 불러오기 =====//
var mysql = require('mysql2');

//===== MySQL 데이터베이스 연결 설정 =====//
var pool = mysql.createPool({
    host: 'localhost',
    user : 'root',
    password : '1234',
    database : 'CobwebDB',
    debug : false
});

// 사용자를 등록하는 함수
var addUser = function(id, name, password, phone, address, callback) {
    console.log('addUser 호출됨.');

    // 커넥션 풀에서 연결 객체를 가져옵니다.
    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 반드시 해제해야 합니다.
            }

            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        // 데이터를 객체로 만듭니다.
        var date = {user_id:id, user_name:name, user_pwd:password, user_phone:phone, user_address:address};

        //SQL문을 실행합니다.
        var exec = conn.query('insert into users set ?', data, function(err, result) {
            conn.release(); // 반드시 해제해야 합니다.
            console.log('실행 대상 SQL : ', +exec.sql);

            if(err) {
                console.log('SQL 실행 시 오류 발생함.');
                console.dir(err);

                callback(err, null);

                return;
            }

            callback(null, result);
        });
    });
};

//사용자 추가 라우팅 함수
router.route('/process/adduser').post(function(req, res) {
    console.log('/process/adduser 호출됨.');

    var paramId = req.body.user_id || req.query.user_id;
    var paramPassword = req.body.user_pwd || req.query.user_pwd;
    var paramName = req.body.user_name || req.query.user_name;
    // var paramAge = req.body.user_phone || req.query.user_phone;

    console.log('요청 파라미터 : ' + paramId + ',' + paramPassword + ',' + paramName + ',');

    // pool 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
    if (pool){
        addUser(paramId, paramName, paramPassword, function(err, addedUser) {
            // 동일한 id로 추가할 때 오류 발생 - 클라이언트로 오류 전송
            if (err) {
                console.error('사용자 추가 중 오류 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            // 결과 객체 있으면 성공 응답 전송
            if (addedUser) {
                console.dir(addeuUser);

                console.log('inserted' + addedUser.affectedRows + 'rows');

                var insertId = addedUser.insertId;
                console.log('추가한 레코드의 아이디 : ' + insertId);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    } else { // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

// 사용자를 인증하는 함수
var authUser = function(id, password, callback) {
    console.log('authUser 호출됨.');

    // 커넥션 풀에서 연결 객체를 가져옵니다
    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release(); // 반드시 해제해야 합니다.
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        var columns = ['id', 'name', 'age'];
        var tablename = 'users';

        // SQL문을 실행합니다.
        var exec = conn.query("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password], function(err, rows) {
            conn.release(); // 반드시 해제해야 합니다.
            console.log('실행 대상 SQL : ' + exec.sql);

            if(rows.length > 0) {
                console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
                callback(null, rows);
            } else {
                console.log("일치하는 사용자를 찾지 못함.");
                callback(null, null);
            }
        });
    });
};

// 로그인 처리 함수
router.route('/process/addUser').post(function(req, res) {
    console.log('/process/addUser 호출됨.');

    // 요청 파라미터 확인
    var paramId = req.body.user_id || req.query.user_id;
    var paramPassword = req.body.user_pwd || req.query.user_pwd;

    console.log('요청 파라미터 : ' + paramId + ',' + paramPassword);

    // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
    if (pool) {
        authUser(paramId, paramPassword, function(err, rows) {
            //오류가 발생했을 때 클라이언트로 오류 전송
            if (err) {
                console.error('사용자 로그인 중 오류 발생 : ' +err.stack);
                res.writeHead('200', {'Content-Type':'text/htaml;charse=utf8'});
                res.write('<h2>사용자 로그인 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            
            if(rows) {
                console.dir(rows);

                var username = rows[0].name;

                res.writeHead('200', {'Content-Type':'text/htaml;charse=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write("<br><br><a href='/views/root_login.html'>다시 로그인하기</a>");
                res.end();
            }
        });
    };
});