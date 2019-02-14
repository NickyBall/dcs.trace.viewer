var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var auth0 = require('passport-auth0');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var strategy = new auth0({
  domain: 'dev-dcs-trace.auth0.com',
  clientID: 'H57kkWkUvGWedmSF-pLkoDK6F478WgWT',
  clientSecret: 'SoiH8uvnUEMt0bb58FajVVzk5jJactmo3CXKlAFAeL1da93_Qezmm9YigKaVKH_a',
  callbackURL: 'http://localhost:3000/callback'
}, function(accessToken, refreshToken, extraParam, profile, done) {
  return done(null, profile);
});

passport.use(strategy);
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'dcs.work',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

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

app.get('/login', passport.authenticate('auth0', {
  clientID: 'H57kkWkUvGWedmSF-pLkoDK6F478WgWT',
  domain: 'dev-dcs-trace.auth0.com',
  redirectUri: 'http://localhost:3000/callback',
  responseType: 'code',
  audience: 'https://dev-dcs-trace.auth0.com/userinfo',
  scope: 'openid, profile'
}), function (req, res) {
  res.redirect('/');
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/error'
}), function (req, res) {
  res.redirect('/user');
});

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
