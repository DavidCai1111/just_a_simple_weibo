var mongoose = require('mongoose');

var wbSchema = new mongoose.Schema({
    name:{type:String},
    content:{type:String}
});

module.exports = wbSchema;