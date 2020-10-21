var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mysql = require("mysql2");
var crypto = require('crypto');
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

var conn_info = {
    host: "localhost",
    port: 3306,
    user: "user",
    password: "1234",
    database: "CobwebDB"
}

module.exports = function (app) {

    app.get('/', function (req, res) {
        console.log(req.session.name);
        if (typeof req.session.name == 'undefined') {
            res.redirect('/index');
        }
        else {
            res.redirect('/login');
        }
    });

    app.post("/login", urlencodedParser, function (req, res) {
        var user_id = req.body.user_id;
        var user_pwd = req.body.user_pwd;
        var user_num = req.body.user_num;
        var conn = mysql.createConnection(conn_info);
        var sql = 'SELECT * FROM db_member WHERE user_id=? and user_pwd=?';
        conn.query(sql, [user_id, user_pwd], function (err, results) {
            if (err) {
                console.log(err);
            } else if (!results[0]) {
                res.render('login');
            }

            var user = results[0];

        });

        req.session.user_id = user_id;
        req.session.user_pwd = user_pwd;
        req.session.user_num = user_num;

        res.redirect("main");
    });

    app.get("/main", function (req, res) {
        var user_id = req.session.user_id;
        var user_pwd = req.session.user_pwd;

        var conn = mysql.createConnection(conn_info);
        var sql = "select * from db_member where user_id=? and user_pwd=?";
        var account_data = [user_id, user_pwd];
        conn.query(sql, account_data, function (err, result) {
            var render_data = {
                id: result[0].user_id,
                pwd: result[0].user_pwd
            }
            if (err) {
                console.log(err);
            }

            res.render("user_profile", render_data);
        });
    });

    app.post("/register", urlencodedParser, function (req, res) {
        var user_name = req.body.user_name;
        var user_id = req.body.user_id;
        var user_pwd = req.body.user_pwd;

        var conn = mysql.createConnection(conn_info);
        var sql = "insert into db_member(user_name, " + " user_id, " + " user_pwd) values(? , ? , ?)";
        var input_data = [user_name, user_id, user_pwd];
        console.log(sql);
        console.log(input_data);

        conn.query(sql, input_data, function (err) {
            if (err) {
                console.log(err);
            }
            conn.end();
            res.redirect("login");
        });
    });

    // app.get("/wallet", function (req, res) {
    //     var wallet_coin = req.session.wallet_coin;
    //     var wallet_amount = req.session.wallet_amount;

    //     var conn = mysql.createConnection(conn_info);
    //     var sql = "select * from db_wallet where wallet_coin=? and wallet_amount=?";
    //     var wallet_data = [wallet_coin, wallet_amount];
    //     conn.query(sql, wallet_data, function (err, result) {
    //         var render_data = {
    //             coin: result[0].wallet_coin,
    //             amount: result[0].wallet_amount
    //         }
    //         if (err) {
    //             console.log(err);
    //         }

    //         res.render("user_wallet", render_data);
    //     });
    //     web3.eth.personal.unlockAccount("0xa6730b2a31d9ba7965e227c931d07ddc71472d3b", "pass1", 600).then(result => console.log('Account unlocked! : ' + result)).catch(err => console.log('err : ' + err));
    //     web3.eth.sendTransaction({
    //         from: '0xa6730b2a31d9ba7965e227c931d07ddc71472d3b',
    //         to: '0x19b36c9b270263c2ddbc3d90cada5294be2b9a04',
    //         value: '1000000000000000'
    //     })
    //         .on('transactionHash', function (hash) {
    //             console.log("hash : " + hash);
    //         })
    //         .on('receipt', function (receipt) {
    //             console.log("receipt : " + receipt)
    //         })
    //         .on('confirmation', function (confirmationNumber, receipt) {
    //             console.log("confirmationNumber : " + confirmationNumber);
    //             console.log("confirm_receipt : " + receipt);
    //         })
    //         .on('error', console.error);

    //     let jsondata = [
    //         {
    //             "constant": true,
    //             "inputs": [],
    //             "name": "doExample1",
    //             "outputs": [
    //                 {
    //                     "internalType": "uint256",
    //                     "name": "a",
    //                     "type": "uint256"
    //                 }
    //             ],
    //             "payable": false,
    //             "stateMutability": "pure",
    //             "type": "function"
    //         },
    //         {
    //             "constant": true,
    //             "inputs": [
    //                 {
    //                     "internalType": "uint256",
    //                     "name": "a",
    //                     "type": "uint256"
    //                 },
    //                 {
    //                     "internalType": "uint256",
    //                     "name": "b",
    //                     "type": "uint256"
    //                 }
    //             ],
    //             "name": "doExample2",
    //             "outputs": [
    //                 {
    //                     "internalType": "uint256",
    //                     "name": "c",
    //                     "type": "uint256"
    //                 }
    //             ],
    //             "payable": false,
    //             "stateMutability": "pure",
    //             "type": "function"
    //         }
    //     ];

    //     let myContract = new web3.eth.Contract(jsondata, '0xa1a39eb6099c9965033a1304338d7306d8a0b2b7', {
    //         from: '0xa6730b2a31d9ba7965e227c931d07ddc71472d3b',
    //         gasPrice: '30000000'
    //     });
    //     myContract.methods.setName(web3.utils.fromAscii("hong")).send()
    //         .then(function (receipt) {
    //             console.log(receipt);
    //             myContract.methods.getName().call()
    //                 .then(function (result) {
    //                     console.log(web3.utils.toAscii(result));
    //                 })
    //         });
    //     myContract.methods.setCost().send(
    //         {
    //             value: 1000000000000000
    //         }
    //     )
    //         .on('transactionHash', function (hash) {
    //             console.log("1.hash : ", hash);
    //         })
    //         .on('confirmation', function (confirmationNumber, receipt) {
    //             console.log("2.confirmationNumber : ", confirmationNumber);
    //             console.log("2.receipt : ", receipt)
    //         })
    //         .on('receipt', function (receipt) {
    //             console.log("3.receipt : ", receipt);
    //             myContract.methods.getCost().call()
    //                 .then(function (result) {
    //                     console.log("cost : ", result);
    //                 });
    //         }).on('error', function (error, receipt) {
    //             console.log("4.error : ", error);
    //             console.log("4.receipt : ", receipt);
    //         });
    //     myContract.methods.doExample1().call().then(function (result) { console.log(result); });
    //     myContract.methods.doExample2(2, 3).call().then(function (result) { console.log(result); });
    // });

    app.get('/login', function (req, res) {
        if (!req.session.name)
            res.render('user_login.ejs');
        else
            res.redirect('/index');
    });
    app.get('/index', function (req, res) {
        res.render('user_index.ejs', { name: req.session.name });
    });
    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });
    app.get("/trade", function (req, res) {
        res.render("user_trade.ejs");
    });
    app.get("/wallet", function (req, res) {
        res.render("user_wallet.ejs");
    });
    app.get("/profile", function (req, res) {
        res.render("user_profile.ejs");
    });
    app.get("/dashboard", function (req, res) {
        res.render("user_dashboard.ejs");
    });
    app.get("/register", function (req, res) {
        res.render("user_register.ejs");
    });
    app.get("/deposit", function (req, res) {
        res.render("user_deposit.ejs");
    });
    app.get("/withdrawals", function (req, res) {
        res.render("user_withdrawals.ejs");
    });
}