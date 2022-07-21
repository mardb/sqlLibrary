var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Sequelize instance connects database
const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
});
// test if the connection is OK
// //async IIFE 
 (async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection to database was successful!');
  } catch (error) {
    console.log('Error connecting to the database.', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', usersRouter);

app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status= 404
  err.message = 'Page Not Found'
  res.render('page-not-found', {err})
});

//Global error handler 
app.use((err, req, res, next) => {
  if(err){
    console.log('Global error handler called', err);
  }
  if(err.status === 404){
    res.status = 404
    res.render('page-not-found', {err});
  } else {
    err.message = err.message || `Oops! looks like something went wrong on the server.`;
    res.locals.error = err;
  }
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
