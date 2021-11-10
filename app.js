var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

var indexRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var tshirtRouter = require('./routes/tshirt');
var orderRouter = require('./routes/order');
var stripeRouter = require('./routes/stripe');
var paypalRouter = require('./routes/paypal');

require('dotenv').config();

var app = express();
// connecting to DB
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB CONNECTED'))
	.catch(() => console.log('DB CONNECTION GOT FAILED'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/tshirt', tshirtRouter);
app.use('/order', orderRouter);
app.use('/stripe', stripeRouter);
app.use('/paypal', paypalRouter);
app.get('/api', (req, res) => {
	res.send('OK');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
