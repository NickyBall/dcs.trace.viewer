require('dotenv').config();
var express = require('express');
var passport = require('passport');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', 
    isLoggedIn, 
    function(req, res, next) {
    var events;
    axios.get(`https://api.applicationinsights.io/v1/apps/${process.env.APP_INSIGHT_ID}/events/traces`, {
        headers: {
        "x-api-key": process.env.APP_INSIGHT_KEY
        }
    }).then(result => {
        events = result.data.value;
        res.render('trace', { title: 'DCS Trace Viewer', user: req.user, events: events });
        // res.send(events);
    }).catch(error => console.log(error));
    
});

module.exports = router;

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  console.log('authenticated: ' + req.isAuthenticated());
  if (req.isAuthenticated())
      return next();
  res.redirect('/auth/login');
}