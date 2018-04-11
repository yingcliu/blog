/**
 * Created by lyingc on 2018/4/9.
 */

var mongoose  = require('mongoose');

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false,
    }
});