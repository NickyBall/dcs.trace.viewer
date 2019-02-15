var express = require('express');
const User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'DCS Trace Viewer' });
});

router.post('/login', (req, res) => {
    console.log(req.body.username);
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
        res.status(401).json({ message: 'Authentication failed. User not found.' });
        } else {
        if (!user.password === req.body.password) {
            res.status(401).json({ message: 'Authentication failed. Wrong username ot password.' });
        } else {
            console.log(user);
            let sess = req.session;
            sess.username = user.username;
            sess._id = user._id;
            res.redirect('/');
        }
        }
    });
});

  module.exports = router;