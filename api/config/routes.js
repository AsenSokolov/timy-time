var express = require('express'),
    router  = express.Router(),
    jwt     = require('express-jwt');

var auth    = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var userAuth = require('../services/authentication');

//User Profile
router.get('/profile', auth, userAuth.profileRead);

//User Authentication
router.post('/auth/register', userAuth.register);
router.post('/auth/login', userAuth.login);
router.get('/auth/facebook', userAuth.facebook);
//router.get('/auth/facebook/callback', userAuth.facebookCallback);

//router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

module.exports = router;