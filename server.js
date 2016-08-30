/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";
var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    config = require('./webpack.config'),
    compiler = webpack(config)


// Setting up faye
var http = require('http'),
    faye = require('faye'),
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});


// Express packages
var express         = require('express'),
    bodyParser      = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session')

// Auth packages
var passport        = require('passport'),
    OAuth2Strategy  = require('passport-oauth2'),
    request         = require('request');


var gitterHost    = process.env.HOST || 'https://gitter.im',
    port          = process.env.PORT || 7000;

// Client OAuth configuration
var clientId      = '37eec08a27ee9f8d7eaef7c0db18de336a7e28b2',
    clientSecret  = '7ca186f41eed07e578600733e8231588da33772e'

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
app.use(methodOverride());
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static( __dirname + '/public'));
app.use("/faye", express.static(__dirname + '/faye'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.get("/home/*", function(req, res) {
  gitter.fetchRooms(req.user, req.session.token, function(err, rooms) {
    if (err) return res.send(500);

    res.render(__dirname + '/views/home.jade', {
      user: req.user,
      token: req.session.token,
      clientId: clientId,
      rooms: rooms
    });
  });
})


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
bayeux.attach(app);
console.log('Demo app running at http://localhost:' + port);
