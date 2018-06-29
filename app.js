const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cookieSession = require('cookie-session');
var User = require('./models/user');
var bodyParser = require("body-parser");
var eventsController = require('./controllers/eventsController')
var usersController = require('./controllers/usersController')
var evidenceController = require('./controllers/evidenceController')
var flash = require('connect-flash');
var googleStrategy = require('passport-google-oauth20');
const session = require("express-session")


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var loginRouter = require('./routes/login');
var eventsRouter = require('./routes/events');
var profileRouter = require('./routes/profile');
var evidenceRouter = require('./routes/evidence');


const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)

var app = express();

const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/EventApp' );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// *************************************
// NEEDED FOR AUTHENTICATION ...
app.use(session({ secret: 'zzbbyanana' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));

// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about',aboutRouter);
app.use('/login',loginRouter);
app.use('/events',eventsRouter);
app.use('/profile', profileRouter);
app.use('/evidence', evidenceRouter);


app.get('/events', eventsController.getAllEvents );
app.post('/saveEvent', eventsController.saveEvent );
app.post('/deleteEvent', eventsController.deleteEvent );

//authentication

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));


// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    console.log("user has been Authenticated")
    res.locals.user = req.user
    res.locals.loggedIn = true
    if (req.user){
      if (req.user.googleemail=='hahagugi@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'teacher'
      } else {
        console.log('student has logged in')
        res.locals.status = 'student'
      }
    }
  }
  next()
})


app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})

// route for logging out
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


app.get('/', (req, res) => {
  res.render('home', {user: req.user})
})

app.get('/auth/google',
    passport.authenticate('google',
                         { scope : ['profile', 'email'] }));

app.get('/login/authorized',
        (req,res,next) => {
          console.log('we are in login/authorized')
          next()
        },
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        }));




// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

app.use('/', function(req, res, next) {
  console.log("in / controller")
  res.render('index', { title: 'Skills Mastery App' });
});


app.listen(5600, () => {
  console.log('app now listening for requests on port 5600');
});


app.use('/', function(req, res, next) {
  console.log("in / controller")
  res.render('index', { title: 'Events Mastery App' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
