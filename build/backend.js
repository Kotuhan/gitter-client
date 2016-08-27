/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {/*jshint globalstrict:true, trailing:false, unused:true, node:true */
	"use strict";
	var webpack = __webpack_require__(1)
	var webpackDevMiddleware = __webpack_require__(2)
	var webpackHotMiddleware = __webpack_require__(3)
	var config = __webpack_require__(4)
	var compiler = webpack(config)

	var express         = __webpack_require__(7);
	var passport        = __webpack_require__(8);
	var OAuth2Strategy  = __webpack_require__(9);
	var request         = __webpack_require__(10);

	var gitterHost    = process.env.HOST || 'https://gitter.im';
	var port          = process.env.PORT || 7000;

	// Client OAuth configuration
	var clientId      = '37eec08a27ee9f8d7eaef7c0db18de336a7e28b2'
	var clientSecret  = '7ca186f41eed07e578600733e8231588da33772e'

	// Gitter API client helper
	var gitter = {
	  fetch: function(path, token, cb) {
	    var options = {
	     url: gitterHost + path,
	     headers: {
	       'Authorization': 'Bearer ' + token
	     }
	    };

	    request(options, function (err, res, body) {
	      if (err) return cb(err);

	      if (res.statusCode === 200) {
	        cb(null, JSON.parse(body));
	      } else {
	        cb('err' + res.statusCode);
	      }
	    });
	  },

	  fetchCurrentUser: function(token, cb) {
	    this.fetch('/api/v1/user/', token, function(err, user) {
	      cb(err, user[0]);
	    });
	  },

	  fetchRooms: function(user, token, cb) {
	    this.fetch('/api/v1/user/' + user.id + '/rooms', token, function(err, rooms) {
	      cb(err, rooms);
	    });
	  }
	};

	var app = express();

	// Middlewares
	app.use(webpackDevMiddleware(compiler, {
	    noInfo: true,
	    publicPath: config.output.publicPath
	}))
	app.use(webpackHotMiddleware(compiler))
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.static( __dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({secret: 'keyboard cat'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);

	// Passport Configuration

	passport.use(new OAuth2Strategy({
	    authorizationURL:   gitterHost + '/login/oauth/authorize',
	    tokenURL:           gitterHost + '/login/oauth/token',
	    clientID:           clientId,
	    clientSecret:       clientSecret,
	    callbackURL:        '/login/callback',
	    passReqToCallback:  true
	  },
	  function(req, accessToken, refreshToken, profile, done) {
	    req.session.token = accessToken;
	    gitter.fetchCurrentUser(accessToken, function(err, user) {
	      return (err ? done(err) : done(null, user));
	    });
	  }
	));

	passport.serializeUser(function(user, done) {
	  done(null, JSON.stringify(user));
	});

	passport.deserializeUser(function (user, done) {
	  done(null, JSON.parse(user));
	});

	app.get('/login',
	  passport.authenticate('oauth2')
	);

	app.get('/login/callback',
	  passport.authenticate('oauth2', {
	    successRedirect: '/home',
	    failureRedirect: '/'
	  })
	);

	app.get('/logout', function(req,res) {
	  req.session.destroy();
	  res.redirect('/');
	});

	app.get('/', function(req, res) {
	  res.render('landing');
	});


	app.get('/home', function(req, res) {
	  if (!req.user) return res.redirect('/');

	  // Fetch user rooms using the Gitter API
	  gitter.fetchRooms(req.user, req.session.token, function(err, rooms) {
	    if (err) return res.send(500);

	    res.render('home', {
	      user: req.user,
	      token: req.session.token,
	      clientId: clientId,
	      rooms: rooms
	    });
	  });

	});

	app.listen(port);
	console.log('Demo app running at http://localhost:' + port);

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("webpack");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("webpack-dev-middleware");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("webpack-hot-middleware");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {var webpack = __webpack_require__(1);
	var path = __webpack_require__(5);
	var fs = __webpack_require__(6);

	var nodeModules = {};
	fs.readdirSync('node_modules')
	  .filter(function(x) {
	    return ['.bin'].indexOf(x) === -1;
	  })
	  .forEach(function(mod) {
	    nodeModules[mod] = 'commonjs ' + mod;
	  });

	module.exports = {
	  entry: './server.js',
	  target: 'node',
	  output: {
	    path: path.join(__dirname, '/'),
	    filename: 'app.js'
	  },
	  externals: nodeModules
	}

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("passport");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("passport-oauth2");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ }
/******/ ]);