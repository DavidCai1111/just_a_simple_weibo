var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    password:{
        type:String
    }
});

userSchema.pre('save',function(next){
   var user = this;
    bcrypt.genSalt(10,function(err,salt){
        if(err) next(err);

        bcrypt.hash(user.password,salt,null,function(err,hash){
            if(err) next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods = {
  comparePasswd : function(_password,cb){
      bcrypt.compare(_password,this.password,function(err,isMatched){
          if(err) cb(err);
          cb(null,isMatched);
      });
  }
};

module.exports = userSchema;