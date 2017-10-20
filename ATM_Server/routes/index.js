var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    var status = 0;//not login
    if(req.isAuthenticated())
    {
        status = 1;
    }
    return res.render('index', {status: status});
});

module.exports = router;
