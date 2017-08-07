var express = require('express');
var path = require('path');
var cookieParser= require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/votingApp', {
  useMongoClient: true
  // wowsers, recheck
  // http://mongoosejs.com/docs/connections.html#use-mongo-client
});

var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var polls = require('./routes/polls');
// var controllers = require('./controllers/clickController.client');


// init app

var app = express();

// view engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs( {defaultLayout:'main'} ));
app.set('view engine', 'handlebars');

// body parser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false }));
app.use(cookieParser());

// set static folder

app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(path.join(__dirname, 'controllers')));

// express session

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// passport init

app.use(passport.initialize());
app.use(passport.session());

// express validator

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// connect flash

app.use(flash());

// global vars for flash

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// custom validator

app.use(expressValidator({
  customValidators: {
    enoughChoices: function(value) {
        return value.length>=2;
    }
  }
}));

// routes

app.use('/', routes);
app.use('/users', users);
app.use('/polls', polls);
// app.use('/controllers', controllers);

// set port and start

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
  console.log("\nServer started on port " + app.get('port') + "...");
});
