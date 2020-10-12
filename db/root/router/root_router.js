var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended:false});
var mysql = require("mysql2");

var conn_info = {
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "CobwebDB"
}

module.exports = function(app){
    app.get("/", function(req,res){
        res.render("root_index.ejs");
    });
    
    app.post("/login", urlencodedParser, function(req,res){
        var user_name = req.body.user_name;
        var user_pwd = req.body.user_pwd;
        //res.send(user_name);

        req.session.user_name = user_name;
        req.session.user_pwd = user_pwd;
        // 서버 main으로 재요청
        res.redirect("main");
    });
    app.get("/main", function(req, res){
        var user_name = req.session.user_name;
        var user_pwd = req.session.user_pwd;
        var conn = mysql.createConnection(conn_info);
        var sql = "select from db_member user_name, user_id, user_pwd"+
        "from CobwebDB order by idx desc";

        conn.query(sql, function(err, rows){
            var render_data = {
                name : user_name,
                pwd : user_pwd
            }

            res.render("root_user.ejs", render_data);
        });
    });

    app.post("/save_db_member", urlencodedParser, function(req,res){
        var user_name = req.body.user_name;
        var user_id = req.body.user_id;
        var user_pwd = req.body.user_pwd;

        var conn = mysql.createConnection(conn_info);
        var sql = "insert into db_member(user_name, "+" user_id, "+" user_pwd) values(? , ? , ?)";
        var input_data = [user_name, user_id, user_pwd];
        console.log(sql);
        console.log(input_data);

        conn.query(sql, input_data, function(err){
            if(err){
                console.log(err);
            }
            conn.end();
            res.redirect("main");
        });
    });
    app.get("/root_login", function(req,res){
        res.render("root_login.ejs");
    });
    app.get("/root_index", function(req,res){
        res.render("root_index.ejs");
    });
    app.get("/root_calendar", function(req,res){
        res.render("root_calendar.ejs");
    });
    app.get("/root_card", function(req,res){
        res.render("root_card.ejs");
    });
    app.get("/root_icons", function(req,res){
        res.render("root_icons.ejs");
    });
    app.get("/root_profile", function(req,res){
        res.render("root_profile.ejs");
    });
    app.get("/root_register", function(req,res){
        res.render("root_register.ejs");
    });
    app.get("/root_reset-password", function(req,res){
        res.render("root_reset-password.ejs");
    });
    app.get("/root_user", function(req,res){
        res.render("root_user.ejs");
    });
}