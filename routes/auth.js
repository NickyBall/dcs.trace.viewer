var express = require('express');
var passport = require("passport");
const User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'DCS Trace Viewer' });
});

router.post('/login', passport.authenticate("local", {

    successRedirect: "/trace",
    failureRedirect: "/auth/login"

    }), (req, res) => {
    }
);

router.post("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

// router.post('/register', function (req, res) {
//     User.register(new User({username:req.body.username, email: req.body.email}),req.body.password, function(err, user){
//         if(err){
//              console.log(err);
//              return res.render('register');
//          } //user stragety
//          passport.authenticate("local")(req, res, function(){
//              res.redirect("/"); //once the user sign up
//         }); 
//     });
// });

  module.exports = router;