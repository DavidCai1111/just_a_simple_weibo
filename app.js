var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mongooseStore = require('connect-mongo')(session);
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();

var dburl = 'mongodb://localhost/simpleWb';

mongoose.connect(dburl);

//models loading
var models_path = __dirname + '/mongoDB/model';
var walk = function(path){
    fs
        .readdirSync(path)
        .forEach(function(file){
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if(stat.isFile()){
                if(/(.*)\.(js|coffee)/.test(file)){
                    require(newPath);
                }
            }
            else if (stat.isDirectory()){
                walk(newPath);
            }
        })
};
walk(models_path);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret:'wb',
    store:new mongooseStore({
        url:dburl,
        collection:'sessions'
    })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    var _user = req.session.user;
    app.locals.user = _user;
    next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/admin',admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
