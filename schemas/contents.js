/**
 * Created by lyingc on 2018/4/11.
 */

var mongoose  = require('mongoose');

module.exports = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    title: String,
    desc: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    }
});