/**
 * Created by lyingc on 2018/4/8.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Categories');

router.use(function(req, res, next) {
    if(!req.userInfo.isAdmin) {
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});

router.get('/', function(req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo,
    });
});

router.get('/user', function(req, res, next) {
    /**
     * 从数据库中读取所有数据
     *
     * limit(Number): 限制每次取的数据条数
     * skip(Number): 忽略的数据条数
     */
    var page  = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    User.count().then(function(count) {
        pages = Math.ceil(count / limit);
        // 取值不能超过总页数
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(users) {
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                page: page,
                count: count,
                pages: pages,
                limit: limit,
            });
        });
    });
});

router.get('/category', function(req, res, next) {
    /**
     * 从数据库中读取所有数据
     *
     * limit(Number): 限制每次取的数据条数
     * skip(Number): 忽略的数据条数
     */
    var page  = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    Category.count().then(function(count) {
        pages = Math.ceil(count / limit);
        // 取值不能超过总页数
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        Category.find().limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                count: count,
                pages: pages,
                limit: limit,
            });
        });
    });
});

router.get('/category/add', function(req, res, next) {
    res.render('admin/category_add', {
        userInfo: req.userInfo,
    })
});

router.post('/category/add', function(req, res, next) {
    var name = req.body.name || '';
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '分类名称不能为空',
        });
        return;
    }

    Category.findOne({
        name: name,
    }).then(function(info) {
        if (info) {
            res.render('admin/error', {
                userInfo: res.userInfo,
                message: '分类已存在',
            });
            return Promise.reject();
        } else {
            return new Category({
                name: name,
            }).save();
        }
    }).then(function(newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        });
    })
});

module.exports = router;