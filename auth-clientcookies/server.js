// NOTE: Application server configuration
// Modules
const express = require('express'),
      bodyParser = require('body-parser'),
      sessions = require('client-sessions'),
      engines = require('consolidate'),       // template eng consolidation lib
      mongoose = require('mongoose'),
      logger = require('morgan'),                        // http request logger
      path = require('path'),
      passport = require('./config/passport'),           // configured passport
      routes = require('./app/routes');

// constants
const port = process.env.PORT || 3000;
const secret = process.env.SECRET;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1/authtest';

// mongoose config
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri)
        .then(() => console.log('MongoDB connection success'))
        .catch(err => console.error('MongoDB connection error'));

// express app config
const app = express();
      app.engine('mustache', engines.mustache);
      app.set('view engine', 'mustache');
      app.set('views', path.join(__dirname, 'views'));

      app.use(express.static(path.join(__dirname, 'public')));

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));

      app.use(sessions({
        cookieName: 'user',     // 'user' cookie name is important for passport
        secret: secret,
        duration: 1 * 60 * 60 * 1000,                                  // in ms
        activeDuration: 0.5 * 60 * 60 * 1000,                          // in ms
        cookie: {
          path: '/',
          ephemeral: true,
          httpOnly: true,
          secure: false
        }
      }));

      app.use('/', routes);

      app.use(logger('dev'));

      app.listen(port)


// shoutout...
console.log('Starting development server at port ' + port + '\nPlease define your SECRET and MONGODB_URI env variables');
