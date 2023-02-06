var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const expresHbs = require('express-handlebars')
const { check , validationResult}=require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { handlebars } = require('hbs');
const { initialize } = require('passport');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


var app = express();
//connect to db
mongoose.connect('mongodb://localhost/cappelo-cafe',{useNewUrlParser:true},(err)=>{
  if(err){
    console.log(err)
  }else{
    console.log('connected to db .....')
  }
} )

//passport for sign in
require('./config/passport');

// view engine setup
app.engine('.hbs' , expresHbs({ defaultLayout :'layout' , extname: '.hbs' ,
 handlebars:allowInsecurePrototypeAccess(Handlebars) ,
helpers:{add : function(value){
  return value + 1;
}} }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.enable('view cash')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({
  secret : 'cappelo-cafe_?@!',
  saveUninitialized:false,
  resave:true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));




//connect to db


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
