var Promise = require('bluebird')
  , config = require(__dirname + '/../config')()
  , util = require('util')
  , events = require('events')
  , httpconn = require('./http')

function Commons() {

  this.validateEmail = function(email, fn) {

    var queryParams = {k: config.emailhippo.key, e: email}
    var options = httpconn.requestOptions({
      protocol: config.emailhippo.protocol,
      resource: 'emailhippo',
      resourcePath: config.emailhippo.path,
      method: 'GET',
      headers: {'Accept': 'application/json'},
      qs: queryParams
    })
  
    console.error("DEBUG: Parsed request options", options)

    httpconn.PromiseGetWithRequest(options)
    .then(function(response) {
      console.log("EMAIL VALIDATION:", response.body)
      if (response.statusCode == 200) {
        var body = JSON.parse(response.body)
        if (body["result"] == 'Ok') {
          return fn(null, 'Ok')
        }
        else {
          return fn('Email invalid')
        }
      }
      else {
        return fn(helpers.newErr(response.body, response.statusCode))
      }
    })
    .catch(function(e) {
      return fn(e)
    })
  }
}

util.inherits(Commons, events.EventEmitter)
module.exports = Commons
