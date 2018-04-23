/**
 * Created by lyingc on 2018/4/9.
 */

var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');

module.exports = mongoose.model('Content', contentsSchema);