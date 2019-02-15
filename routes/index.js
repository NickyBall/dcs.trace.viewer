var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { title: 'DCS Trace Viewer', user: req.user });
});

module.exports = router;

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  console.log('authenticated: ' + req.isAuthenticated());
  if (req.isAuthenticated())
      return next();
  res.redirect('/auth/login');
}