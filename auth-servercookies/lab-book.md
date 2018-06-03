1. cli
npm init -y
npm i -S express
npm i -S express-session
npm i -S body-parser
npm i -S mongoose
npm i -S mustache
npm i -S consolidate
npm i -S connect-flash
npm i -S connect-mongo
npm i -S passport passport-local
npm i -S nodemon
npm i -D morgan

python -V
python2 -V
brew install python@2
npm i -S argon2 --python2

- check package.json
- add start script with nodemon server.js


2. cli
touch .gitignore
touch Procfile

touch server.js

mkdir app
touch app/models.js
touch app/routes.js

mkdir config
touch config/database.js
touch config/passport.js

mkdir views
touch views/index.html
touch views/register.html
touch views/login.html
touch views/dashboard.html

mkdir public
touch public/app.css


3. server.js (initial boilerplate)
``` javascript
// modules
const express = require('express');

// constants
const port = process.env.PORT || 3000;
const secret = process.env.SECRET;
const mongoUri = process.env.MONGODB_URI

// express app config
const app = express();
      app.listen(port, console.log(() => port));
```

<!-- cli -->
export PORT=3000 SECRET='tajemstvi' MONGO_URI='mongodb://127.0.0.1/authtest'
npm start


4. server.js
- setup body-parser (body-parser)
  https://github.com/expressjs/body-parser

- setup morgan (morgan)
  https://github.com/expressjs/morgan

- setup view engine and templating (consolidate + mustache)
  either use mustache-express
  https://github.com/bryanburgers/node-mustache-express
  or use consolidate + mustache
  https://expressjs.com/en/api.html#app.engine (docs point at consolidate.js)
  https://github.com/tj/consolidate.js
  https://expressjs.com/en/4x/api.html#app.set (set view engine and views dir)
  https://nodejs.org/api/path.html (path.join)

- setup mongo (mongoose + connect-mongo)
  http://mongoosejs.com/docs/connections.html

``` javascript
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri)
        .then(() => console.log('MongoDB connection success'))
        .catch(err => console.error('MongoDB connection error'));
```

- setup router
  create instance of express.Router() in routes.js
  require router in server.js
  create index.html in views and point root route to it

  https://expressjs.com/en/api.html#express.router

``` javascript
  // app/routes.js
  const express = require('express');
  const router = express.Router();
  router.get('/', (req, res) => res.render('index'));

  // server
  const routes = require('./app/routes')
  app.use('/', routes)
```


5. models.js
- create user schema and export User model
- create mongoose middleware for hashing
  http://mongoosejs.com/docs/middleware.html
- create model instance method for verification
  http://mongoosejs.com/docs/guide.html

- use argon2 for hashing
  https://github.com/ranisalt/node-argon2


6. routes.js
- create simple registration and login GET routes
- create dashboard route  


7. server.js
- setup using passport and sessions (connect-flash, express-session, passport)
- use express-sessions before using passport.session() (passport docs)
- app.use sessions, then flash, then passport, then routes  
  https://gist.github.com/brianmacarthur/a4e3e0093d368aa8e423
  https://github.com/expressjs/session
  https://github.com/jdesboeufs/connect-mongo
  http://www.passportjs.org/docs/

``` javascript
  app.use(session({
      cookie: {
        path: '/',
        maxAge: 1 * 60 * 60 * 1000;
        httpOnly: true,
        secure: false,
      },
      resave: false,
      saveUninitialized: true,
      secret: secret,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        touchAfter: 0.5 * 60 * 60 * 1000;
      })
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
```

- express-session notes:
  Note: Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.

  Note: Since version 1.5.0, the cookie-parser middleware no longer needs to be used for this module to work. This module now directly reads and writes cookies on req/res. Using cookie-parser may result in issues if the secret is not the same between this module and cookie-parser.

  Warning: The default server-side session storage, MemoryStore, is purposely not designed for a production environment. It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing.

  https://github.com/expressjs/session#compatible-session-stores

- flash notes:
  req.flash() or req.flash errors will generally occur if:
    - there is no session store
    - no cookie is served
    - app.use of session, flash, and passport middleware is in a strange order

    https://github.com/keystonejs/keystone/issues/1674
    https://github.com/passport/express-4.x-local-example/issues/8
    https://stackoverflow.com/questions/36087350/typeerror-req-flash-is-not-a-function-using-passport-with-nodejs-username-an?rq=1&utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa


8. passport.js
- configure passport and expose it with exports
- passReqToCallback is not in the official documentation
- use Easy Authentication with Node passport configuration is used
  http://www.passportjs.org/docs/
  https://github.com/jaredhanson/passport
  https://scotch.io/tutorials/easy-node-authentication-setup-and-local
  https://stackoverflow.com/questions/11784233/using-passportjs-how-does-one-pass-additional-form-fields-to-the-local-authenti?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa


9. routes.js
- add login and registration POST routes  
- add logout route


10. bootstrap
    starter template
    https://getbootstrap.com/docs/4.0/getting-started/introduction/

11. Procfile
```
web: node server.js
```


12. heroku cli
- if not using heroku toolbelt:
  git remote add heroku git.heroku.com:arcane-plains-74809.git

- otherwise:
  heroku create
  https://arcane-plains-74809.herokuapp.com/
  https://git.heroku.com/arcane-plains-74809.git

git push heroku HEAD:master
heroku open
heroku logs --tail
heroku config:set SECRET=tajemstvi NODE_ENV=production
heroku config:get MONGODB_URI
heroku addons:create mongolab:sandbox

https://elements.heroku.com/addons/mongolab
https://scotch.io/tutorials/use-mongodb-with-a-node-application-on-heroku

13. Things to check out
- [passport-local-mongoose](https://github.com/saintedlama/passport-local-mongoose)
- [passport-local-mongoose tutorial](https://github.com/mjhea0/passport-local-express4)
