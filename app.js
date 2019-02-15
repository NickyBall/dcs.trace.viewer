require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/loginapp?retryWrites=true`, function (err, client) {
  if (err) console.log('error: ' + err);
  else console.log('connect');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'dcs.work',
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
  res.locals.loggedIn = false;

  if (req.session.passport && typeof eq.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }

  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.get('/session', (request, response) => {
  let sess = request.session
  console.log(sess)
  response.status(200).send('username = ' + sess.username + '  ' + '_id = ' + sess._id)

})

app.get('/user', function (req, res, next) {
  res.render('user', {
    user: req.user
  });
});

app.get('/error', function (req, res, next) {
  res.render('error');
});

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
