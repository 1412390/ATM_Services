var express = require('express');
var db = require('./db.js');
var expressValidator = require('express-validator');
var router = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const secretOrPrivateKey = 'superSecret';

//moment
var moment = require('moment');

router.post('/infor-user', function (req, res, next) {

    var token = req.body.token;

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        const sql = `select* from user where id = ${user_id}`;

        var get_data = db.load(sql).then(
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
    });
});
router.post('/withdrawal', function (req, res, next) {

    var token = req.body.token;

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        const sql = `select* from card where user_id = ${user_id}`;

        var get_data = db.load(sql).then(
            data => {

                return res.json({
                    success: true,
                    card: data[0]
                });
            },
            err => { res.json({ success: false, message: err }); }
        );
    });
});
router.post('/excute_withdrawal', function (req, res, next) {

    var token = req.body.token;

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        if (err) return res.json({ message: err });
        var user_id = decoded.user_id;

        const sql = `select* from card where user_id = ${user_id}`;

        var get_data = db.load(sql).then(
            data => {

                var available_balance = parseInt(data[0].available_balance);

                var current_balance = parseInt(data[0].current_balance);

                var withdrawal_val = parseInt(req.body.withdraw_money);

                available_balance = available_balance - withdrawal_val;

                current_balance = current_balance - withdrawal_val;

                var sql = `update card set available_balance = ${available_balance}, current_balance = ${current_balance} where id = ${data[0].id}`;

                db.update(sql).then(
                    data => {//update succesful

                        var date_current = moment();

                        var content = 'Giao dịch rút tiền lúc ' + date_current.format('DD-MM-YYYY H:mm') + ' số tiền ' + withdrawal_val;

                        var sql_history = `INSERT INTO history(date, value, content, user_id) VALUES (
                        ${date_current.unix()},
                        "${withdrawal_val}",
                        "${content}",
                        ${user_id})`;

                        db.load(sql_history).then(
                            success => {
                                const sql = `select * from user where id = ${user_id}`;
                                var get_data = db.load(sql).then(
                                    data => {
                                        return res.json({
                                            success: true
                                        });
                                    },
                                    err => console.log(err + '')
                                );
                            },
                            err => console.log(err + '')
                        );
                    },
                    err => console.log(err + '')
                );
            },
            err => console.log(err + '')
        );
    });
});
router.post('/intra-transfer', function (req, res, next) {

    var token = req.body.token;

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        const sql = `select* from card where user_id = ${user_id}`;

        var get_data = db.load(sql).then(
            data => {

                return res.json({
                    success: true,
                    card: data[0]
                });
            },
            err => { res.json({ success: false, message: err }); }
        );
    });
});
router.post('/excute_intra-transfer', function (req, res, next) {

    var token = req.body.token;

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        const receiver = parseInt(req.body.receiver);

        const transfer_money = parseInt(req.body.transfer_money);

        const sql_user = `select* from card where user_id = ${user_id}`;

        var get_data_user = db.load(sql_user).then(
            user => {

                var sql_reciver = `select* from card where user_id =  ${receiver}`;

                var get_data_receiver = db.load(sql_reciver).then(
                    receiver => {

                        if (receiver.length === 0) {

                            return res.json({ success: false, message: 'Người nhận không tồn tại!' });
                        }


                        const service_fee = 3300;

                        var user_bank = user[0].bank;
                        var available_balance_user = parseInt(user[0].available_balance) - transfer_money - service_fee;
                        var current_balance_user = parseInt(user[0].current_balance) - transfer_money - service_fee;

                        var reciever_bank = receiver[0].bank;
                        var available_balance_receiver = parseInt(receiver[0].available_balance) + transfer_money;
                        var current_balance_receiver = parseInt(receiver[0].current_balance) + transfer_money;


                        if (user_bank === reciever_bank) {

                            //update user_card
                            var sql_update_user = `update card 
                            set available_balance = ${available_balance_user}, 
                            current_balance = ${current_balance_user}
                            where id = ${user[0].id}`;

                            db.update(sql_update_user).then(
                                success => {
                                    //update reciever_card
                                    var sql_update_receiver = `update card 
                                    set available_balance = ${available_balance_receiver}, 
                                    current_balance = ${current_balance_receiver}
                                    where id = ${receiver[0].id}`;

                                    db.update(sql_update_receiver).then(
                                        success => {

                                            var date_current = moment();

                                            var content = 'Giao dịch chuyển tiền nội bộ lúc '
                                                + date_current.format('DD-MM-YYYY H:mm') + ' số tiền '
                                                + transfer_money + ' ID người nhận: ' + receiver[0].user_id;

                                            var sql_history = `insert into history (date, value, content, user_id) values (
                                            ${date_current.unix()},
                                            "${transfer_money}",
                                            "${content}",
                                            ${user_id})`;

                                            db.load(sql_history).then(
                                                success => { return res.json({ success: true }); },
                                                err => console.log(err + '')
                                            );
                                        },
                                        err => console.log(err + '')
                                    );
                                },
                                err => console.log(err + '')
                            );
                        }
                        else {
                            return res.json({ success: false, message: 'Người nhận không cùng ngân hàng!' });
                        }
                    },
                    err => {
                        console.log(err + '');
                    }
                );
            },
            err => console.log(err + '')
        );
    });
});
router.get('/interbank-transfer', function (req, res, next) {

    var token = req.body.token;

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        const sql = `select* from card where user_id = ${user_id}`;

        var get_data = db.load(sql).then(
            data => {

                return res.json({
                    success: true,
                    card: data[0]
                });
            },
            err => { res.json({ success: false, message: err }); }
        );
    });
});
router.post('/excute_interbank-transfer', function (req, res, next) {

    var token = req.body.token;

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        const receiver = parseInt(req.body.receiver);

        const transfer_money = parseInt(req.body.transfer_money);

        var sql_user = `select* from card where user_id =  ${user_id}`;

        var get_data_user = db.load(sql_user).then(
            user => {

                var sql_reciver = `select* from card where user_id =  ${receiver}`;
                var get_data_receiver = db.load(sql_reciver).then(
                    receiver => {

                        if (receiver.length === 0) {

                            return res.json({ success: false, message: 'Người nhận không tồn tại!' });
                        }

                        const service_fee = 11000;


                        var user_bank = user[0].bank;
                        var available_balance_user = parseInt(user[0].available_balance) - transfer_money - service_fee;
                        var current_balance_user = parseInt(user[0].current_balance) - transfer_money - service_fee;

                        var reciever_bank = receiver[0].bank;
                        var available_balance_receiver = parseInt(receiver[0].available_balance) + transfer_money;
                        var current_balance_receiver = parseInt(receiver[0].current_balance) + transfer_money;


                        //update user_card
                        var sql_update_user = `update card 
                            set available_balance = ${available_balance_user}, 
                            current_balance = ${current_balance_user}
                            where id = ${user[0].id}`;

                        db.update(sql_update_user).then(
                            success => {
                                //update reciever_card
                                var sql_update_receiver = `update card 
                                    set available_balance = ${available_balance_receiver}, 
                                    current_balance = ${current_balance_receiver}
                                    where id = ${receiver[0].id}`;

                                db.update(sql_update_receiver).then(
                                    success => {

                                        var date_current = moment();

                                        var content = 'Giao dịch chuyển tiền liên ngân hàng lúc '
                                            + date_current.format('DD-MM-YYYY H:mm') + ' số tiền '
                                            + transfer_money + ' ID người nhận: ' + receiver[0].user_id;

                                        var sql_history = `insert into history (date, value, content, user_id) values (
                                            ${date_current.unix()},
                                            "${transfer_money}",
                                            "${content}",
                                            ${user_id})`;

                                        db.load(sql_history).then(
                                            success => { return res.json({ success: true }); },
                                            err => console.log(err + '')
                                        );
                                    },
                                    err => console.log(err + '')
                                );
                            },
                            err => console.log(err + '')
                        );
                    },
                    err => {
                        console.log(err + '');
                    }
                );
            },
            err => console.log(err + '')
        );
    });
});
router.post('/history', function (req, res, next) {

    var token = req.body.token;

    jwt.verify(token, secretOrPrivateKey, function (err, decoded) {

        var user_id = decoded.user_id;

        var date_start = req.body.date_start + ' 00:00:00';

        var date_end = req.body.date_end + ' 23:59:59';

        var dateFormat = "MM/DD/YYYY H:mm:ss";

        var d_start = moment(date_start, dateFormat).unix();

        var d_end = moment(date_end, dateFormat).unix();

        var sql = `select* from history where user_id = ${user_id} and date >= ${d_start} and date <= ${d_end} order by id DESC`;

        db.load(sql).then(
            success => {
                return res.json({message: true, success: success});
            },
            err => console.log(err + '')
        )

    });
});
router.get('/test', function (req, res, next) {

    res.render('card/test');
});
router.get('/error', function (req, res, next) {

    return res.render('card/error', { error: '' });
});
module.exports = router;