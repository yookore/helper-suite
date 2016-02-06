var app = require(__dirname + '/../server').app
var express = require(__dirname + '/../server').express
var HelperSuite = require('./commons')
var Commons = new HelperSuite()
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var cors = require('cors');
var util = require('util')

var jsonParser = bodyParser.json({ type: 'application/json' } );

router.options('*', cors());
router.use(cors());
router.use(cookieParser());

router.use(validator({
  customValidators: {
    isArray: function(value) {
      return Array.isArray(value)
    },
    isBoolean: function(val) {
      return _.isBoolean(val)
    },
    isObject: function(val) {
      return _.isObject(val)
    },
    isUrl: function(val) {
      return isUrl(val)
    },
  }
}));

// middleware to detect UA
router.use(function(req, res, next) {
  req.ua = req.headers["user-agent"]
  next()
})

// Router middleware
// Protective middleware to validate access token
router.use(function(req, res, next) {
  if (!req.headers.authorization) {
    console.log('Unauthorized access. Rejecting request from ', req.ip)
    return res.sendStatus(401)
  }
  else {
    return next()
  }
})

router.get('/ping', function(req, res) {
  console.log('Commons loaded!')
  return res.status(200).send('Commons loaded!')
})

/**
 * Service to validate email addresses with emailhippo
 * @param email
 */ 
router.post('/validate-email', jsonParser, function(req, res) {
  console.log('"validateEmail start time": %d, "UA": %s', new Date(), req.ua);
  if (!req.body) return res.sendStatus(400);
  if(!req.accepts('application/json')) {
    return res.sendStatus(406);
  }

  req.checkBody('email', 'required').notEmpty();
  req.assert('email', 'valid email required').isEmail();

  var errors = req.validationErrors();
  if (errors) {
    res.status(400).send('There have been validation errors: ' + util.inspect(errors));
    return;
  }
  var email = req.body.email

  Commons.validateEmail(email, function(err, valid) {
    if (err) {
      return res.status(404).send(err)
    }
    else {
      return res.status(200).send(valid)
    }
  })
})

module.exports = router;
