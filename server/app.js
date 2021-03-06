const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const addresses = require('./routes/addresses');
const collections = require('./routes/collections')
const evaluations = require('./routes/evaluations')
const orders = require('./routes/order')
const passport = require('./routes/passport')
const shop = require('./routes/shop')
const sEvaluations = require('./routes/sEvaluation')
const sOrders = require('./routes/sOrder')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'avatars')))
app.use(express.static(path.join(__dirname,'shopImages')))

app.use('/', index);
app.use('/users', users);
app.use('/addresses', addresses)
app.use('/collections',collections)
app.use('/evaluations',evaluations)
app.use('/passport',passport)
app.use('/orders',orders)
app.use('/shop', shop)
app.use('/sOrders', sOrders)
app.use('/sEvaluations',sEvaluations)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
