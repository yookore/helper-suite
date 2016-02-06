var config = require('./config')()
var express = require('express')
var app = express()

// start http server
var server = app.listen(config.port, function () {

  process.setMaxListeners(0);
  var host = server.address().address
  var port = server.address().port

  console.log('Helper Suite listening at http://%s:%s', host, port)

})

exports = module.exports = {}
exports.express = express
exports.app = app
exports.server = server
