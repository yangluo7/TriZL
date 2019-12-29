var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//router require
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

// swagger require
const swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');
let configSwagger = require('./config/swagger');

// session redis require
const session = require('express-session');
let configSession = require('./config/session');

//express
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(configSession.secret));
app.use(express.static(path.join(__dirname, 'public')));

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(configSwagger.swaggerOptions);

// session
app.use(session(configSession.options));

// ---------- router begin -----------

app.use('/', indexRouter);
app.use('/user', userRouter);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// router swagger
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile("favicon.ico");
});

//---------- router end -----------



module.exports = app;
