// NOTE: Application server configuration
// Modules
const express = require('express'),
      bodyParser = require('body-parser'),
      flash = require('connect-flash'),
      engines = require('consolidate'),       // template eng consolidation lib
      session = require('express-session'),
      mongoose = require('mongoose'),
      MongoStore = require('connect-mongo')(session),
      morgan = require('morgan'),                        // http request logger
      mustache = require('mustache'),
      path = require('path'),
      passport = require('./config/passport'),           // configured passport
      protectedRoutes = require('./app/routes/protected'),        // app routes
      publicRoutes = require('./app/routes/public');              // app routes 

// Constants
const port = process.env.PORT || 3000;
const secret = process.env.SECRET;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1/authtest';

// Mongo configuration
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri)
        .then(() => console.log('MongoDB connection success'))
        .catch(err => console.error('MongoDB connection error'));

// Express app configuration
const app = express();
      app.engine('html', engines.mustache);           // consolidating mustache
      app.set('view engine', 'html');
      app.set('views', path.join(__dirname, 'views'));

      app.use(express.static(path.join(__dirname, 'public')));

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));

      app.use(session({
          cookie: {
            path: '/',
            maxAge: 1 * 60 * 60 * 1000,                      // in milliseconds
            httpOnly: true,
            secure: false,
          },
          resave: false,
          saveUninitialized: true,
          secret: secret,
          store: new MongoStore({                     // default is MemoryStore
            mongooseConnection: mongoose.connection,
            touchAfter: 0.5 * 60 * 60 * 1000
          })
        })
      );
                                                        // set up in this order
      app.use(flash());                 // sessions > flash > passport > routes
      app.use(passport.initialize());
      app.use(passport.session());

      app.use(morgan('dev'));

      app.use('/', publicRoutes);
      app.use('/app', protectedRoutes);
      app.listen(port)


// shoutout...
console.log('Starting development server at port ' + port + '\nPlease define your SECRET and MONGODB_URI env variables');
