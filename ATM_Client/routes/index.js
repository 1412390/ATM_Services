var express = require('express');
var router = express.Router();
//storage
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
/* GET home page. */
router.get('/', function (req, res, next) {
    var status = 0;//not login
    if(localStorage.getItem('login')==='true')
    {
        status = 1;
    }
    return res.render('index', {status: status});
});

module.exports = router;
