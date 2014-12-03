var express = require('express');
var router = express.Router();
var Wb = require('../mongoDB/model/wb');

/* GET home page. */
router.get('/', function(req, res) {
    Wb.find({}).exec(function(err,wbs){
        res.render('index', { title: 'a simple weibo' ,
                              wbs:wbs});
    });
});

module.exports = router;
