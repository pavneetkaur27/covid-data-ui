"use strict";
const express                     = require('express');
const app                         = express();
const path                        = require('path');
const cookieParser                = require('cookie-parser');
const bodyParser                  = require('body-parser');
const morgan                      = require('morgan');
const redis                       = require("redis");
const session                     = require('express-session');
const redisStore                  = require('connect-redis')(session);
const helmet                      = require('helmet');
const server_debug                = require('debug')('Server');
const utils                       = require('./utils');
const compression                 = require('compression');
const cors                        = require('cors')

const config                      = require('./config');
const sConf                       = config.AppConfig.server;


//Security
app.use(helmet());

//Performance
app.use(compression());

//Cors
app.use(cors());

/*----------------------Require route-----------------------*/
const index                       = require('./routes/index');
const userIndexRoute              = require('./routes/user/index');
/*----------------------------------------------------------*/

//connect_mongo
// config.db;

//connect_redis
const client  = redis.createClient({
  host : config.REDIS_HOST,
  port : config.REDIS_PORT
});
// config.redis(client,sConf,logger);
config.redis(client,sConf);

app.use(express.static(path.join(__dirname,"public")));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
    res.header("Access-Control-Allow-Credentials", "true");
    if(!req.headers.origin){
        return res.status(200).sendFile('public/html/400.html', { root: __dirname });
    }
    if ('OPTIONS' === req.method) {
      return res.status(200).end();
    }
    return next();
});

app.options("*",function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.status(200).end();
});


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var session_secret = sConf.SESSION_SECRET;
app.use(session(
    {
        secret:session_secret,
        proxy: true,
        resave: true,
        store: new redisStore({ 
          host: sConf.REDIS_HOST,
          port: sConf.REDIS_PORT,
          client: client,
          ttl :  sConf.REDIS_TTL
        }),
        saveUninitialized: false,
        resave: false
    }
));

/*---------All Routes----------*/ 
app.use('/', index);
app.use('/user', userIndexRoute);
/*-----------------------------*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  if(err.message){
    var errMsg = err.message;
    console.log("err "+ errMsg);
  }else{
        var errMsg = err;
        console.log("err "+ errMsg);
  }
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send(errMsg);
  err.status == 404 ? server_debug("Not found") : server_debug("Server Error");
});

module.exports = app;