/**
 * Created by lyingc on 2018/4/8.
 */

var express = require('express');
var router = express.Router();
var Category = require('../models/Categories');
var Content = require('../models/Contents');
var data;
router.use(function(req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    };

    Category.find().sort({_id: -1}).then(function(categories) {
        data.categories = categories;
        next();
    })
});

router.get('/', function(req, res, next) {
    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 10;
    data.pages = 0;
    data.contents = [];

    var where = {};
    if (data.category) {
        where.category = data.category;
    }

    Content.where(where).count().then(function(count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        // 取值不能超过总页数
        data.page = Math.min(data.page, data.pages);
        // 取值不能小于1
        data.page = Math.max(data.page, 1);

        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().sort({addTime: -1}).limit(data.limit).skip(skip).populate(['category', 'user'])

    }).then(function(contents) {
        /*if (data.category) {
            var arr = [];
            contents.forEach(function(content) {
                if (content.category.id == data.category) {
                    arr.push(content);
                }
            });
            data.contents = arr;
        } else {
            data.contents = contents;
        }*/
        data.contents = contents;
        res.render('main/index', data);
    });
});

router.get('/view', function(req, res) {
    var contentId = req.query.contentId || '';
    var category = req.query.category || '';

    Content.findOne({
        _id: contentId
    }).then(function(content) {
        data.content = content;
        data.category = category;
        content.views ++;
        content.save();
        res.render('main/view', data);
    });
});

module.exports = router;