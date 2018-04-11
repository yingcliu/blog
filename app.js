/**
 * Created by lyingc on 2018/4/8.
 * 应用程序入口
 */
var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Cookies = require('cookies');
var User = require('./models/User');

var app = express();
app.use('/public', express.static(__dirname + '/public'));
app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');

// 开发过程中关闭缓存
swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({extended: true}));


app.use(function(req, res, next) {
    req.cookies = new Cookies(req, res);
    req.userInfo = {};

    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        } catch(e) {
            next();
        }
    } else {
        next();
    }
});
// app.get('/', function(req, res, next) {
//     // res.send('<h1>欢迎光临我的博客</h1>');
//     res.render('index');
// });

app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

mongoose.connect('mongodb://localhost:27018/blog', function(err) {
    "use strict";
    if (err) {
        console.log('连接数据库失败');
    } else {
        console.log('连接数据库成功');
        app.listen(8081);
    }
});