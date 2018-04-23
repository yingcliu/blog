/**
 * Created by lyingc on 2018/4/8.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Categories');
var Content = require('../models/Contents');

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

        // sort 1:升序   -1:降序
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
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

router.get('/category/edit', function(req, res, next) {
    var id = req.query.id || '';

    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            })
        }
    })
});

router.post('/category/edit', function(req, res) {
    var id = req.query.id;
    var name =req.body.name || '';

    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            if (category.name == name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '分类信息修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '已存在同名的分类名称'
            })
            return Promise.reject();
        } else {
            return Category.update({
                _id: id,
            }, {
                name: name
            });
        }
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类信息修改成功',
            url: '/admin/category'
        });
    }).catch(function() {})
});

router.get('/category/delete', function(req, res, next) {
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类信息删除成功',
            url: '/admin/category'
        });
    }).catch(function() {})
});

router.get('/content', function(req, res) {
    /**
     * 从数据库中读取所有数据
     *
     * limit(Number): 限制每次取的数据条数
     * skip(Number): 忽略的数据条数
     */
    var page  = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    Content.count().then(function(count) {
        pages = Math.ceil(count / limit);
        // 取值不能超过总页数
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        // sort 1:升序   -1:降序
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate('category').then(function(contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                count: count,
                pages: pages,
                limit: limit,
            });
        });
    });
});

router.get('/content/add', function(req, res) {
    Category.find().sort({_id: -1}).then(function(categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories,
        })
    });
});

router.post('/content/add', function(req, res) {
    var category = req.body.category;
    var title = req.body.title;
    var desc = req.body.desc;
    var content = req.body.content;

    if (category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }
    if (title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }
    if (desc == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '简介不能为空'
        });
        return;
    }
    if (content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空'
        });
        return;
    }
    new Content({
        category: category,
        title: title,
        desc: desc,
        content: content,
    }).save().then(function(content) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    });
});

router.get('/content/edit', function(req, res) {
    var id = req.query.id || '';
    var categories = [];
    Category.find().sort({_id: -1}).then(function(rs) {
        categories = rs;
        return Content.findOne({
            _id: id
        }).populate('category')
    }).then(function(content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '内容不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                content: content,
                categories: categories
            })
        }
    });
});

router.post('/content/edit', function(req, res) {
    var category = req.body.category;
    var title = req.body.title;
    var desc = req.body.desc;
    var content = req.body.content;

    if (category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }
    if (title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }
    if (desc == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '简介不能为空'
        });
        return;
    }
    if (content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空'
        });
        return;
    }
    new Content({
        category: category,
        title: title,
        desc: desc,
        content: content,
    }).save().then(function(content) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    });
});

module.exports = router;