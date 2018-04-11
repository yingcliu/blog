/**
 * Created by lyingc on 2018/4/9.
 */

var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Categories', categoriesSchema);