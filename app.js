var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var multer = require('multer');
var cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cookieSession({
  keys:['aa','bb'],
  name:'newsapp_id'
  // maxAge:1000*60*10
}))

//统一跨域配置
app.use(cors({
  "origin": ["http://127.0.0.1:8054","http://localhost:5000","http://localhost:8087"],  //允许所有前端域名
  "credentials":true,//允许携带凭证
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //被允许的提交方式
  "allowedHeaders":['Content-Type','Authorization']//被允许的post方式的请求头
}));

//资源托管
app.use(express.static(path.join(__dirname, 'public/template')));

//给静态资源条件虚拟目录admin,
//views模板里面的/指向public/admin,加上管理端的响应正好是app.use('/admin/xx)
//所以ejs里面的/ 或者 ./ 或者 ../../都指向了public/admin
app.use('/admin',express.static(path.join(__dirname, 'public/admin/')));
app.use(express.static(path.join(__dirname, 'public')));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('reg')!==-1){
      cb(null, path.join(__dirname, 'public/upload/user'))
    }else if(req.url.indexOf('banner')!==-1){
      cb(null, path.join(__dirname, 'public/upload/banner'))
    }else{
      cb(null, path.join(__dirname, 'public/upload/product'))
    }
  }
})

var upload = multer({ storage });//存储方式dest指定死了，storage分目录,目录没有匹配导致请求挂起
// let objMulter = multer({ dest: path.join(__dirname, 'public/upload')});	//实例化  返回 multer对象
app.use(upload.any());  	//any 允许上传任何文件

//admin 接口   /admin/xx


//api 接口   /api/xxx
app.all('/api/*',require("./routes/api/params"));//处理所有主服务请求

app.use('/api/login',require('./routes/api/login'))

app.use('/api/reg',require('./routes/api/reg'))
app.use('/api/user',require('./routes/api/user'))
app.use('/api/logout',require('./routes/api/logout'))
app.use('/api/banner',require('./routes/api/banner'))
app.use('/api/swipe',require('./routes/api/swipe'))
app.use('/api/:products',require('./routes/api/product'))


//代理接口 /proxy/xxx

app.use('/proxy/top250',require('./routes/proxy/top250'))
app.use('/proxy/in_theaters',require('./routes/proxy/in_theaters'))
app.use('/proxy/coming_soon',require('./routes/proxy/coming_soon'))

//推送


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

  if(req.url.indexOf('/api') !== -1){
    res.send({error:1,msg:'错误的接口和请求方式'})
  }else if(req.url.indexOf('/admin') !== -1){
    res.render('error');
  }
  
  /* else {
    res.sendFile(path.join(__dirname, 'public','template', 'index.html'));
  } */

  // res.sendFile('文件.html');
});

module.exports = app;
