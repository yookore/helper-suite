var app = require(__dirname + '/../server').app
var express = require(__dirname + '/../server').express
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json({ type: 'application/json' } );

//app.options('*', cors());
//app.use(cors());
//app.use(cookieParser());

// middleware to detect UA
/*router.use(function(req, res, next) {
  req.ua = req.headers["user-agent"]
  next()
})*/

var api = require('./api')
app.use('/v1', api);
