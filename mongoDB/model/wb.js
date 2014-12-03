var mongoose = require('mongoose');
var wbSchema = require('../schema/wb');

var wb = mongoose.model('wb',wbSchema);

module.exports = wb;
