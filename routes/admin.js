var express = require('express');
var router = express.Router();
var Wb = require('../mongoDB/model/wb');
var User = require('../mongoDB/model/user');

//insert weibo
router.get('/insert',function(req,res){
    if (!req.session.user) res.redirect('/');
    res.render('insert',{title:'微博录入页'})
});
router.post('/insert',function(req,res){

    var wbObj = req.body.wb;
    console.log('wbObj is');
    console.log(wbObj);
    var _wb = new Wb(wbObj);
    _wb.save(function(err,wb){
        if(err) console.log(err);
        console.log(wb);
        res.redirect('/');
    });
});
//deleteweibo
router.delete('/delete',function(req,res){
    var id = req.query.id;
    console.log('receive the id: ');
    console.log(id);
    if(id){
        Wb.remove({_id:id},function(err,wb){
            if(err) console.log(err);
            console.log('del done!');
            res.json({success:1})
        });
    }
});
//sign in
router.get('/signup',function(req,res){
    res.render('signUp',{title:'用户注册页'});
});

router.post('/signup',function(req,res){
    var userObj = req.body.user;
    console.log('userObj is');
    console.log(userObj);
    User.findOne({name:userObj.name},function(err,user){
        if(err) console.log(err);
        if(user){
            console.log(user.name + 'has already signed up');
            res.redirect('/signup');
        }else{
            var _user = new User(userObj);
            _user.save(function(err,user){
                if(err) console.log(err);
                console.log(user);
                res.redirect('/');
            });
        }
    });
});

//login
router.get('/login',function(req,res){
    res.render('login',{title:'用户登录页'});
});

router.post('/login',function(req,res){
    var userObj = req.body.user;
    console.log('userObj is');
    console.log(userObj);
    User.findOne({name:userObj.name},function(err,user){
        if(err) console.log(err);
        if(!user){
            console.log('not find the user: '+userObj.name);
            res.redirect('/');
        }else{
            user.comparePasswd(userObj.password,function(err,isMatched){
                if(isMatched){
                    console.log('password is matched');
                    req.session.user = user;
                    return res.redirect('/');
                }else{
                    console.log('password is wrong');
                    return res.redirect('/');
                }
            });
        }
    });
});

//logout
router.get('/logout',function(req,res){
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;