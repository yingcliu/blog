/**
 * Created by lyingc on 2018/4/8.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Contents');

var responseData;

router.use(function(req, res, next) {
    responseData = {
        code: 0,
        message: '',
    };

    next();
});

router.post('/user/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if (username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        return res.json(responseData);
    }
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    if (password != repassword) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username,
    }).then(function(userInfo) {
        if (userInfo) {
            responseData.code = 4;
            responseData.message = '用户已经被注册了';
            res.json(responseData);
            return;
        }
        var user = new User({
            username: username,
            password: password,
        });
        return user.save();
    }).then(function(newUserInfo) {
        responseData.message = '注册成功';
        res.json(responseData);
    }).catch(function() {});
});

router.post('/user/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if (username == '' || password == '') {
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }
    User.findOne({
        username: username,
        password: password
    }).then(function(info) {
        if (!info) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误，请重试';
            res.json(responseData);
            return;
        }
        responseData.message = '登录成功';
        responseData.userInfo = {
            username: info.username,
            _id : info._id
        };
        req.cookies.set('userInfo', JSON.stringify(responseData.userInfo));
        res.json(responseData);
    });
});

router.get('/user/logout', function(req, res, next) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
});

router.get('/comment', function(req, res) {
    var contentId = req.query.contentId || '';
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        responseData.message = '获取成功';
        responseData.data = content.comments;
        res.json(responseData);
    });
});

router.post('/comment/post', function(req, res, next) {
    var contentId = req.body.contentId || '';
    var content = req.body.content || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: content
    };
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent) {
        responseData.message = '评论发布成功';
        responseData.data = newContent;
        res.json(responseData);
    })
});

module.exports = router;