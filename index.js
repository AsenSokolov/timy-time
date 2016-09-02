var express         = require('express'),
    port            = process.env.PORT || 3030,
    path            = require('path'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    passport        = require('passport');

// INIT DB and Data Model
require('./api/config/db');
require('./api/db/user');

// INIT Passport configuration after we defined the model
require('./api/config/passport');

// INIT API Routes configuration
var routesApi   = require('./api/config/routes');

// Create express application
var app         = express();

// View engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Static resources(Client side initialization)
app.use(express.static(path.join(__dirname, 'app')));

// PassportJS initialization
app.use(passport.initialize());

// API Routes setup
app.use('/api', routesApi);

// Render index.html from our Angular SPA
app.use(function(req, res){
    res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// Catch 404 Error and forward to error handler
app.use(function(){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// ERROR HANDLERS
// Catch unauthorised errors
app.use(function(err, req, res, next){
    if(err.name === "UnauthorizedError"){
        res.status(401);
        res.json({
            "message": err.name + ": " + err.message
        });
    }
});

// Development error handler
// Will print stacktrace
if(app.get('env') === "development"){
    app.use(function(err, req, res, next){
        res.status(err.status || 500);
        res.render('error',{
            message: err.message,
            error: err
        });
    });
}

// Production error handler
// No stacktraces leaked to user
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port);

module.exports = app;