var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var cors = require("cors");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors);
app.use('/', indexRouter);
app.use('/users', usersRouter);


// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     next();
// });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//连接Mongodb数据库
// mongoose.connect('mongodb://127.0.0.1:27017/test', {
// 	useUnifiedTopology: true,
// 	useNewUrlParser: true
// });

// mongoose.connection.on('connected', () => {
// 	console.log('mongoose connected success!')
// });

// mongoose.connection.on('error', () => {
// 	console.log('mongoose connected fail!')
// });



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



 
 // app.get('/api',function(req,res){           //配置接口api
 //     res.status(200),
 //     res.json(infor)
 // })
 
 //配置服务端口
 // var server = app.listen(6000,function(){
 //     var host = server.address().address;
 //     var port = server.address().port;
     console.log('服务器http://127.0.0.1:6000正在运行')
 // })


module.exports = app;
