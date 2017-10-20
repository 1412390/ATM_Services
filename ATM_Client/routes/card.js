const express = require('express');
const db = require('./db.js');
const expressValidator = require('express-validator');
const router = express.Router();
//authencation packed
//storage
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
//server
const axios = require('axios');
//moment
const moment = require('moment');
//config'
const config = require('../config/config');

router.get('/infor-user', function (req, res, next) {

    if (localStorage.getItem('login') !== 'true') {
        return res.redirect('/users/login');
    }

    //prepare data
    const data = {
        token: localStorage.getItem('token'),
    };
    var url = config.URL_SERVER + '/card/infor-user';
    axios.post(url, data)
        .then(
            response => {

                var success = response.data.success;

                if(success === true){

                    return res.render('card/infor-user', {user: response.data.user});
                }
                return res.render('card/error', {error: response.data.message});
            }
        )
        .catch(
            err => console.log(err + '')
        );
});
router.get('/withdrawal', function (req, res, next) {

    if (localStorage.getItem('login') !== 'true') {
        return res.redirect('/users/login');
    }
    //prepare data
    const data = {token: localStorage.getItem('token')};
    var url = config.URL_SERVER + '/card/withdrawal';
    axios.post(url, data)
        .then(
            response => {

                var success = response.data.success;

                if(success === true){
                    return res.render('card/withdrawal', {card: response.data.card});
                }
                return res.render('card/error', {error: response.data.message});
            }
        )
        .catch(
            err => console.log(err + '')
        );
});
router.post('/withdrawal', function (req, res, next) {

    if (localStorage.getItem('login') !== 'true') {
        return res.redirect('/users/login');
    }
    //prepare data
    const data = {
        token: localStorage.getItem('token'),
        withdraw_money: req.body.withdraw_money,

    };
    var url = config.URL_SERVER + '/card/excute_withdrawal';
    axios.post(url, data)
        .then(
            response => {

                var success = response.data.success;

                if(success === true){
                    return res.redirect('/');
                }
                return res.render('card/error', {error: response.data.message});
            }
        )
        .catch(
            err => console.log(err + '')
        );
});
router.get('/intra-transfer', function (req, res, next) {

    if (localStorage.getItem('login') !== 'true') {
        return res.redirect('/users/login');
    }
    //prepare data
    const data = {token: localStorage.getItem('token')};
    var url = config.URL_SERVER + '/card/intra-transfer';
    axios.post(url, data)
        .then(
            response => {

                var success = response.data.success;

                console.log(success);

                if(success === true){
                    return res.render('card/intra-transfer', {card: response.data.card});
                }
                return res.render('card/error', {error: response.data.message});
            }
        )
        .catch(
            err => console.log(err + '')
        );
});
router.post('/intra-transfer', function (req, res, next) {

    if (localStorage.getItem('login') !== 'true') {
        return res.redirect('/users/login');
    }
    //prepare data
    const data = {
        token: localStorage.getItem('token'),
        receiver: req.body.receiver,
        transfer_money: req.body.transfer_money
    };

    var url = config.URL_SERVER + '/card/excute_intra-transfer';

    axios.post(url, data)
        .then(
            response => {

                var success = response.data.success;
                if(success === true){
                    return res.redirect('/');
                }
                return res.render('card/error', {error: response.data.message});
            }
        )
        .catch(
            err => console.log(err + '')
        );
});
router.get('/interbank-transfer', function (req, res, next) {

    if (localStorage.getItem('login') !== 'true') {
        return res.redirect('/users/login');
    }
    //prepare data
    const data = {token: localStorage.getItem('token')};
    var url = config.URL_SERVER + '/card/intra-transfer';
    axios.post(url, data)
        .then(
            response => {

                var success = response.data.success;
                if(success === true){
                    return res.render('card/interbank-transfer', {card: response.data.card});
                }
                return res.render('card/error', {error: response.data.message});
            }
        )
        .catch(
            err => console.log(err + '')
        );
});
router.post('/interbank-transfer', function (req, res, next) {

    if (localStorage.getItem('login') !== 'true') {
        return res.redirect('/users/login');
    }
    //prepare data
    const data = {
        token: localStorage.getItem('token'),
        receiver: req.body.receiver,
        transfer_money: req.body.transfer_money
    };

    var url = config.URL_SERVER + '/card/excute_interbank-transfer';

    axios.post(url, data)
        .then(
            response => {

                var success = response.data.success;
                if(success === true){
                    return res.redirect('/');
                }
                return res.render('card/error', {error: response.data.message});
            }
        )
        .catch(
            err => console.log(err + '')
        );

});
router.get('/history', function(req, res, next){

    if (localStorage.getItem('login') !== 'true') {
        return res.redirect('/users/login');
    }
    return res.render('card/history');

});
router.post('/history', function(req, res, next){

    if (localStorage.getItem('login') !== 'true') {
        return res.redirect('/users/login');
    }

    //prepare data
    const data = {
        token: localStorage.getItem('token'),
        date_start: req.body.date_start,
        date_end: req.body.date_end
    };
    var url = config.URL_SERVER + '/card/history';
    axios.post(url, data)
        .then(
            response => {

                var message = response.data.message;

                if(message === true){

                    var success = response.data.success;

                    console.log(success);

                    return res.send(success);
                }
            }
        )
        .catch(
            err => console.log(err + '')
        );
});
module.exports = router;