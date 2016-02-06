var http = require('http');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var config = require(__dirname + '/../config')();

function httpconn() {

}

module.exports = new httpconn();

httpconn.prototype.httpOptions = function(options) {
  var resource = options.resource ? options.resource : null;
  var resourcePath = options.resourcePath;
  if(!resource) {
    return;
  }
  var headers = (options.headers) ? options.headers : {};
  var auth = options.auth ? options.auth : null
  var reqOpts = {
    host: config[resource].host,
    port: config[resource].port,
    path: resourcePath,
    method: options.method,
    headers: headers
  }
  if (auth) {
    reqOpts.auth = auth
  }
  return reqOpts;
};

httpconn.prototype.requestOptions = function(options) {
  var resource = options.resource ? options.resource : null;
  var resourcePath = options.resourcePath;
  if(!resource) {
    return;
  }
  var headers = (options.headers) ? options.headers : {};
  var auth = options.auth ? options.auth : null
  var host = config[resource].host
  var body = options.body ? options.body: null
  var port = config[resource].port ? ':' + config[resource].port : ''
  var protocol = options.protocol ? options.protocol : config.protocol

  if (auth) {
   host = auth + "@" + config[resource].host
  }
  var reqOpts = {
    url: protocol + "://" + host + port + resourcePath,
    method: options.method,
    headers: headers
  }

  console.error("DEBUG: Parsed request uri", require('url').parse(reqOpts.url))

  if(body) reqOpts.body = body
  if(options.json) reqOpts.json = options.json 
  if(options.qs) reqOpts.qs = options.qs

  return reqOpts;
};

httpconn.prototype.externalHttpOptions = function() {

};

httpconn.prototype.httprequest = function(options, callback) {
  return http.request(options, callback);
};
httpconn.prototype.makeHttpRequest = function(options, callback) {
  return http.request(options, callback);
};

/**
 * Retrieves http uri property
 * @param {string} resource
 */ 
httpconn.prototype.buildUri = function(resource) {
  return config[resource].uri;
};

httpconn.prototype.PromiseGetWithRequest = function(options) {
  return request.getAsync(options)
};

httpconn.prototype.PromiseGetRequest = Promise.method(function(options) {
    return new Promise(function(resolve, reject) { 
        var request = http.request(options, function(response) {
            // Bundle the result
            var result = {
                'httpVersion': response.httpVersion,
                'httpStatusCode': response.statusCode,
                'headers': response.headers,
                'body': '',
                'trailers': response.trailers,
            };

            // Build the body
            response.on('data', function(chunk) {
                result.body += chunk;
            });

            // Resolve the promise
            resolve(result);
        });

        // Handle errors
        request.on('error', function(error) {
            console.log('Problem with request:', error.message);
            reject(error);
        });

        if(options.postBody) {
          request.write(options.postBody);
        }
        request.end();
    });
});

httpconn.prototype.PromisePostRequest = Promise.method(function(options) {
    return new Promise(function(resolve, reject) { 
        var request = http.request(options, function(response) {
            // Bundle the result
            var result = {
                'httpVersion': response.httpVersion,
                'httpStatusCode': response.statusCode,
                'headers': response.headers,
                'body': '',
                'trailers': response.trailers,
            };

            // Build the body
            response.on('data', function(chunk) {
                result.body += chunk;
            });

            // Resolve the promise
            resolve(result);
        });
        
        // Handle errors
        request.on('error', function(error) {
            console.log('Problem with request:', error.message);
            reject(error);
        });

        // Resolve the promise when the response ends
        /*response.on('end', function() {
            resolve(result);
        });*/
        request.write(options.postBody);
        request.end();
    });
});

httpconn.prototype.PromisePostWithRequest = function(options, data) {
  return request.postAsync(options)
};

httpconn.prototype.PromisePutRequest = Promise.method(function(options) {
    return new Promise(function(resolve, reject) { 
        var request = http.request(options, function(response) {
            // Bundle the result
            var result = {
              'httpVersion': response.httpVersion,
              'httpStatusCode': response.statusCode,
              'headers': response.headers,
              'body': '',
              'trailers': response.trailers,
            };

            // Build the body
            response.on('data', function(chunk) {
                result.body += chunk;
            });

            // Resolve the promise
            resolve(result);
        });

        // Handle errors
        request.on('error', function(error) {
            console.log('Problem with request:', error.message);
            reject(error);
        });

        request.write(options.postBody);
        request.end();
    });
});

httpconn.prototype.PromisePutWithRequest = function(options, data) {
  return request.putAsync(options, data)
};

httpconn.prototype.PromisePatchRequest = Promise.method(function(options) {
    return new Promise(function(resolve, reject) { 
        var request = http.request(options, function(response) {
            // Bundle the result
            var result = {
              'httpVersion': response.httpVersion,
              'httpStatusCode': response.statusCode,
              'headers': response.headers,
              'body': '',
              'trailers': response.trailers,
            };

            // Build the body
            response.on('data', function(chunk) {
                result.body += chunk;
            });

            // Resolve the promise
            resolve(result);
        });

        // Handle errors
        request.on('error', function(error) {
            console.log('Problem with request:', error.message);
            reject(error);
        });

        request.write(options.postBody);
        request.end();
    });
});

httpconn.prototype.PromisePatchWithRequest = function(options, data) {
  return request.patchAsync(options, data)
};

httpconn.prototype.PromiseDeleteRequest = Promise.method(function(options) {
    return new Promise(function(resolve, reject) { 
        var request = http.request(options, function(response) {
            // Bundle the result
            var result = {
                'httpVersion': response.httpVersion,
                'httpStatusCode': response.statusCode,
                'headers': response.headers,
                'body': '',
                'trailers': response.trailers,
            };

            // Build the body
            response.on('data', function(chunk) {
                result.body += chunk;
            });

            // Resolve the promise
            resolve(result);
        });
        

        // Handle errors
        request.on('error', function(error) {
            console.log('Problem with request:', error.message);
            reject(error);
        });

        // Resolve the promise when the response ends
        /*response.on('end', function() {
            resolve(result);
        });*/
        if(options.postBody) {
          request.write(options.postBody);
        }
        request.end();
    });
});

httpconn.prototype.PromiseDeleteWithRequest = function(options) {
  return request.delAsync(options)
};
