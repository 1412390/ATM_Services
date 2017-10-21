const config = require("../../config");
const db = require(config.PATH_DB);
const jwt = require(config.JWT); // used to create, sign, and verify tokens
const secretOrPrivateKey = config.secretOrPrivateKey;

exports.getUser = function (req, res, next) {

    var token = req.headers['token'];

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        const sql = `select* from user where id = ${user_id}`;

        db.load(sql).then(
            data => {

                var d = new Date(data[0].dob * 1000);
                data[0].dob = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
                return res.json({
                    success: true,
                    user: data[0]
                });
            },
            err => { res.json({ success: false, message: err }); }
        );
    });};
exports.updateUser = function (req, res, next) {

    var token = req.headers['token'];
    var user = req.body.user;

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        const sql = `update user SET username = "${user.username}", password = "${user.password}", name= "${user.name}", dob= ${user.dob}, email= "${user.email}" where id = ${user_id}`;
        console.log(sql);
        db.update(sql).then(
            data => {
                return res.json({
                    success: true,
                    user: "update successful!"
                });
            },
            err => { res.json({ success: false, message: err }); }
        );
    });};

exports.createUser = function (req, res, next) {

    //prepare data
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var name = req.body.name;
    var dob = new Date(req.body.dob).getTime() / 1000;

    const sql = `insert into user (username,  password, email, name, dob) VALUES ('${username}', '${password}', '${email}', '${name}', ${dob})`;

    // excute sql
    db.insert(sql).then(
        data => {//successful!
            return res.json({
                success: true,
                msg: 'Register successful. This is user has id = ' + data
            })
        },
        err => { res.json({ success: false, message: err }); });};
exports.deleteUser = function (req, res, next) {


    var token = req.headers['token'];

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        const sql = `delete from user where id = ${user_id}`;

        db.load(sql).then(
            data => {

                return res.json({
                    success: true,
                    msg: "Delete successful!"
                });
            },
            err => { res.json({ success: false, message: err }); }
        );
    });};
