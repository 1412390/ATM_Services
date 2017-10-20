var express = require('express');
var db = require('./db.js');
var router = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');
const secretOrPrivateKey = 'superSecret';
/* GET users listing. */

router.post('/login', function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var sql = `select id from user where username = "${username}" and password = "${password}"`;
    //excute sql
    db.load(sql).then(
        data => {
            if (data.length === 0) {
                res.json({ success: false, message: "Please check your username or password again!" });
            }
            else {//successful!

                var payload = {
                    user_id: data[0].id
                };

                var token = jwt.sign(payload, secretOrPrivateKey, {
                    expiresIn: 1440 // expires in 24 hours
                });

                return res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });

            }
        },
        err => { //fail
            res.json({ success: false, message: err });
        }
    );

});

router.post('/dashboard', function (req, res, next) {

    var token = req.body.token;

    jwt.verify(token, secretOrPrivateKey, function(err, decoded) {

        var user_id = decoded.user_id; 

        const sql = `select* from user where id = ${user_id}`;

        var get_data = db.load(sql).then(
            data => {
        
                return res.json({
                    success: true,
                    user: data[0]
                });
            },
            err => {res.json({ success: false, message: err });}
        );
      });
});
module.exports = router;
