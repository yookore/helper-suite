var url = require('url')
var cfenv = require("cfenv")
var appEnv = cfenv.getAppEnv()
var rabbitUri = null
var redisups = null

if(!appEnv.isLocal) {
  // rabbit ups
  rabbitService = appEnv.getService('rabbitmq')
  rabbitCreds = rabbitService.credentials
  var rabbitObj = {
    protocol: 'amqp',
    slashes: true,
    auth: [rabbitCreds.username, rabbitCreds.password].join(':'),
    hostname: rabbitCreds.host,
    port: rabbitCreds.port
  }
  rabbitUri = url.format(rabbitObj)

  // redis ups
  redisups = appEnv.getService('redis')
  console.log("redisups", redisups)
}

var vcap_services;
var vcap_application
if(process.env.VCAP_SERVICES) {
  vcap_services = JSON.parse(process.env.VCAP_SERVICES)
  console.log(vcap_services)
}
if(process.env_VCAP_APPLICATION) {
  vcap_application = JSON.parse(process.env.VCAP_APPLICATION)
  console.log(vcap_application)
}

var config = {
  local: {
    appname: 'helper-suite',
    mode: 'local',
    port: process.env.VCAP_APP_PORT || 3006,
    protocol: 'http',
    uri: 'http://localhost:3006',
    token_secret: 'useraccountservice',
    uas: {
      host: 'uas.apps.yookosapps.com',
      path: '/v1',
      //port: 3000,
      uri: 'http://localhost:3000/'
    },
    emailhippo: {
      key: '6AD13DC6',
      protocol: 'https',
      host: 'api1.27hub.com',
      path: '/api/emh/a/v2'
    }
  },
  dev: {
    appname: 'helper-suite',
    mode: 'dev',
    port: process.env.VCAP_APP_PORT || 3006,
    protocol: 'http',
    uri: 'http://localhost:3006',
    token_secret: 'useraccountservice',
    uas: {
      host: 'uas.apps.yookosapps.com',
      path: '/v1',
      //port: 3000,
      uri: 'http://localhost:3000/'
    },
    emailhippo: {
      key: '6AD13DC6',
      protocol: 'https',
      host: 'api1.27hub.com',
      path: '/api/emh/a/v2'
    }
  },
  beta: {
    appname: appEnv ? appEnv.name : 'helper-suite',
    mode: appEnv ? appEnv.app.space_name : 'local',
    port: process.env.VCAP_APP_PORT,
    protocol: 'http',
    uri: appEnv ? appEnv.url : 'http://helper-suite.apps.yookosapp.com',
    token_secret: 'useraccountservice',
    uas: {
      host: 'uas.apps.yookosapps.com',
      path: '/v1',
      uri: 'http://localhost:3000/'
    },
    emailhippo: {
      key: '6AD13DC6',
      protocol: 'https',
      host: 'api1.27hub.com',
      path: '/api/emh/a/v2'
    }
  }
}
module.exports = function(mode) {
  var env = !appEnv.isLocal ? appEnv.app.space_name : 'local'
  return config[mode || env || 'local'] || config.local;
};
module.exports.cfenv = appEnv
