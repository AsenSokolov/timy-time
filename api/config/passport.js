'use strict';

var passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    mongoose        = require('mongoose'),
    User            = mongoose.model('User'),
    configAuth      = require('./authorization');



passport.use('local-login', new LocalStrategy({
    usernameField: 'email'
}, function(username, password, done){
    User.findOne({ 'local.email': username }, function(err, user){

        // Return if user not found in database
        if(!user){
            console.log("Return if user not found in database");
            return done(null, false,{
                message: 'User not found!'
            });
        }

        // Return if password is wrong
        if(!user.validPassword(password)){
            console.log("Return if password is wrong");
            return done(null, false, {
                message: 'Wrong password!'
            });
        }

        console.log("If credentials are correct, return user object");
        // If credentials are correct, return user object
        return done(null, user);

    });
}));



// =========================================================================
// FACEBOOK ================================================================
// =========================================================================

passport.use( new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL

}, function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        console.log("Profile ID: " + profile.id);

        // find the user in the database based on their facebook id
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {


            console.log("ZEMI: " + user);

            // if there is an error, stop everything and return that
            //// ie an error connecting to the database
            //if (err){
            //    console.log("Error Please Try Again!");
            //    return done(null, false,{
            //        message: 'Error Please Try Again!'
            //    });
            //}
            //
            //// if the user is found, then log them in
            //if (user) {
            //    console.log("Return if password is wrong");
            //    return done(null, false, {
            //        message: 'Wrong password!'
            //    });
            //} else {
            //    // if there is no user found with that facebook id, create them
            //    var newUser            = new User();
            //
            //    // set all of the facebook information in our user model
            //    newUser.facebook.id    = profile.id; // set the users facebook id
            //    newUser.facebook.token = token; // we will save the token that facebook provides to the user
            //    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            //    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
            //
            //    // save our user to the database
            //    newUser.save(function(err) {
            //        if (err)
            //            throw err;
            //
            //        // if successful, return the new user
            //        return done(null, newUser);
            //    });
            //}

        });
    });

}));