/**
 * Created by lyingc on 2018/4/8.
 */

var express = require('express');
var router = express.Router();
var Category = require('../models/Categories');

router.get('/', function(req, res, next) {
    Category.find().sort({_id: -1}).then(categories => {
        res.render('main/index', {
            userInfo: req.userInfo,
            categories: categories,
        });
    });
});

module.exports = router;