/**
 * Created by lyingc on 2018/4/8.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('main/index', {
        userInfo: req.userInfo
    });
});

module.exports = router;