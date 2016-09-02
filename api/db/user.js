var mongoose    = require('mongoose'),
    crypto      = require('crypto'),
    jwt         = require('jsonwebtoken');

var userSchema   = new mongoose.Schema({

    local:{
        email:{
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        hash: String,
        salt: String
    },

    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

userSchema.methods.setPassword = function(password){
    this.local.salt = crypto.randomBytes(16).toString('hex');
    this.local.hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
    return this.local.hash === hash;
};

userSchema.methods.generateJwt = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id:    this._id,
        email:  this.local.email,
        name:   this.local.name,
        exp:    parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET");
};

mongoose.model('User', userSchema);