require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');


//imports from folders in app
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/userRouter');
const jwtStrategyCheck = require('./routes/lib/passport/userPassport');
const cocktail = require('./routes/cocktail/cocktailRouter')
//connecting to backend database
mongoose.connect(process.env.MONGO_DB,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log("MongoDB Connect");
}).catch((e)=>{
  console.log(e)
});



var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
passport.use("jwt-user",jwtStrategyCheck);


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/users/cocktail',cocktail)

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
  res.json({message: "App Error handle", err: err.message});
});

module.exports = app;
