var express = require('express');
var db = require('./db.js');
var md5 = require('md5');
var expressValidator = require('express-validator');
var router = express.Router();
var axios = require('axios');
var config = require('../config/config');
//storage
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
/* GET users listing. */
router.get('/login', function (req, res, next) {

    return res.render('users/login', {
        username: '',
        title: 'Login',
        error: ''});
});

router.post('/login', function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    //validate form
    req.checkBody('username', 'Username field is not empty!').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long!').len(4, 15);
    req.checkBody('password', 'Password field is not empty').notEmpty();
    req.checkBody('password', 'Password must be between 8-64 characters long!').len(8, 64);
    const error = req.validationErrors();
    if (error) {
        return res.render('users/login', {
            username: req.body.username,
            title: 'Login Failed!',
            error: error,
        });
    }
    else {
        //prepare data
        const data = {
            username: username,
            password: password
        };

        var url = config.URL_SERVER + '/users/login';

        axios.post(url, data)
            .then(
                response => {

                    var success = response.data.success;
                    var msg = [{msg: response.data.message}];

                    if(success === true){

                        var token = response.data.token;
                        localStorage.setItem('token', token);
                        localStorage.setItem('login', 'true');
                        console.log(token);
                        return  res.redirect(config.URL_CLIENT + '/users/dashboard');
                    }
                    else {

                        return res.render('users/login', {
                            username: req.body.username,
                            title: 'Login Failed!',
                            error: msg
                        });
                    }
                }
            )
            .catch(
                err => console.log(err + '')
            );
    }
});

router.get('/add', function (req, res, neogoutxt) {

    return  res.render('users/add', {
        title: 'REGISTER',
        username: '',
        password: '',
        cfm_password: '',
        email: '',
        name: '',
        dob: '',
        error: ''});
});

router.post('/add', function (req, res, next) {

    //valitdate form
    req.checkBody('username', 'Username field is not empty!').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long!').len(4, 15);
    req.checkBody('password', 'Password field is not empty').notEmpty();
    req.checkBody('password', 'Password must be between 8-64 characters long!').len(8, 64);
    req.checkBody('cfm_password', 'Confirm Password field is not empty').notEmpty();
    req.checkBody('cfm_password', 'Confirm Password must be between 8-64 characters long!').len(8, 64);
    req.checkBody('cfm_password', 'Confirm Password does not match!').equals(req.body.password);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email must be between 8-64 characters long!').len(8, 64);
    req.checkBody('name', 'Name field is not empty!').notEmpty();
    req.checkBody('name', 'Name must be less 64 characters long!').len(0, 64);
    const error = req.validationErrors();
    if (error)
    {
        console.log('error: ' + JSON.stringify(error));
        return res.render('users/add', {
            title: 'Register Failed!',
            error: error,
            username: req.body.username,
            password: req.body.password,
            cfm_password: req.body.cfm_password,
            email: req.body.email,
            name: req.body.name,
            dob: req.body.dob
        });
    }
});

router.get('/edit/:id', function (req, res, next) {
  var id = req.params.id;
  res.send('This user has id = ' + id);
});

router.get('/delete/:id', function (req, res, next) {
  var id = req.params.id;
  res.send('This user has id = ' + id + ' deleted!');
});

router.post('/isUserExist', function (req, res, next) {

    var username = req.body.username;
    var sql = `select count(*) as count from user where username = ${username}`;
    var count_user = db.load(sql).then(
        data => res.send(data),
        err => console.log(err + ''));

});

router.get('/dashboard',  function (req, res, next) {

    var token = localStorage.getItem('token');
    var login = localStorage.getItem('login');

    if(login ==='true')
    {
        if(token!=='')
        {
            //prepare data
            const data = {
                token: token,
            };

            var url = config.URL_SERVER + '/users/dashboard';

            axios.post(url, data)
                .then(
                    response => {

                        var success = response.data.success;

                        if(success === true){

                            var user = response.data.user;
                            return res.render('users/dashboard', {user: user});
                        }
                        else {
                            return res.render('users/error');
                        }
                    }
                )
                .catch(
                    err => console.log(err + '')
                );
        }
    }
    else {
        res.redirect('/');
    }
});

router.get('/error', function (req, res, next) {
    res.render('users/error', {error: ''});
});

router.get('/logout', function(req, res, next){

    localStorage.removeItem('token');
    localStorage.setItem('login', 'false');
    res.redirect('/');
});

module.exports = router;
