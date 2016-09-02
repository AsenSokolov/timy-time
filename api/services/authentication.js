var passport    = require('passport'),
    mongoose    = require('mongoose'),
    User        = mongoose.model('User');

var sendJSONresponse = function(res, status, content){
    res.status(status);
    res.json(content);
};


module.exports.profileRead = function(req, res){
    if(!req.payload._id){
        res.status(401).json({
            "message": "Unauthorized Error: Private Profile!"
        });
    }else{
        User.findById(req.payload._id).exec(function(err, user){
            res.status(200).json(user);
        });
    }

};

module.exports.register = function(req, res){
    User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
        // if there are any errors, return the error

        if (err) {
            res.status(401).json({message: 'Something goes wrong please try again'});
        }

        // check to see if there is already a user with that email
        if (user) {
            res.status(401).json({message: 'That email is already taken!'});
        } else {
            var newUser = new User();

            newUser.local.name   = req.body.name;
            newUser.local.email  = req.body.email;

            newUser.setPassword(req.body.password);

            newUser.save(function(err){
                if(err){
                    res.status(401).json({message: 'Something goes wrong please try again'});
                }else{
                    var token = newUser.generateJwt();
                    res.status(200);
                    res.json({
                        "token": token,
                        "message": "Registration Successful"
                    });
                }
            });
        }
    });
};

module.exports.login = function(req, res){
    passport.authenticate('local-login', function(err, user, info){
        var token;

        //If Passport throws/catches an error
        if(err){
            res.status(404).json(err);
            return;
        }

        //If a user is found
        if(user){
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        }else{
            //If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};

module.exports.facebook = function(req, res){
    passport.authenticate('facebook', { scope : 'email' })(req, res);

};

module.exports.facebookCallback = function(req, res){


    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    })(req, res);

    console.log(":::::::::::::::::::::::::::::::::::::");
    console.log("++++++++++++ module.exports.facebook");
    console.log(":::::::::::::::::::::::::::::::::::::");

    //passport.authenticate('facebook', function(err, user, info){
    //    console.log("facebookCallback");
    //});

    //passport.authenticate('facebook-login', { scope : 'email' })(req, res);

};