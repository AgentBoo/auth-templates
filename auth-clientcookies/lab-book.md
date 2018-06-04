### Lab book

1. cli
```
python -V
python2 -V
brew install python@2

npm init -y
npm i -S express
npm i -S body-parser
npm i -S client-sessions
npm i -S mongoose
npm i -S morgan
npm i -S mustache
npm i -S nodemon
npm i -S consolidate
npm i -S passport passport-local
npm i -S connect-flash
npm i -S argon2 --python2
```

- node-gyp cannot be pointed at python 3 versions (can interfere with Anaconda)
  https://github.com/nodejs/node-gyp/issues/746

- check package.json


2. cli
```
touch .gitignore

touch server.js
touch Procfile

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
```


3. server.js (initial boilerplate)
``` javascript
// modules
const express = require('express');

// constants
const port = process.env.PORT || 3000;

// express app config
const app = express();
      app.listen(port, console.log(() => port));

```


4. cli
export PORT=3000 SECRET='tajemstvi' MONGODB_URI='mongodb://127.0.0.1/authtest'


4. server.js
- setup body-parser
  https://www.npmjs.com/package/body-parser

- setup morgan
  https://github.com/expressjs/morgan

- setup templating engine
  consolidate + mustache
  https://github.com/tj/consolidate.js

  mustache-express
  https://github.com/bryanburgers/node-mustache-express

  https://expressjs.com/en/api.html#app.engine        (recommends consolidate)
  https://expressjs.com/en/4x/api.html#app.set
  https://nodejs.org/api/path.html

- setup serving static files
  https://expressjs.com/en/starter/static-files.html

``` javascript
// works with views with .mustache extension
app.engine('mustache', engines.mustache);
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
```

``` javascript
// works with views with .html extension
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
```

- setup mongo (mongoose + connect-mongo)
  http://mongoosejs.com/docs/connections.html

``` javascript
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri)
        .then(() => console.log('MongoDB connection success'))
        .catch(err => console.error('MongoDB connection error'));
```


5. /views
- replace .html extensions with .mustache if using mustache for view engine


6. routes.js
- setup routes using express.Router() in routes.js
- require routes in server.js and use in an app
  https://expressjs.com/en/guide/routing.html

``` javascript
// routes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index'));

module.exports = router;

// server.js
const routes = require('./app/routes')
app.use('/', routes);
```


7. server.js
- setup client sessions
  https://github.com/mozilla/node-client-sessions
- cookie name has to be 'session' to make it work with passport and flash
  https://github.com/jaredhanson/passport/issues/185 (it says to use 'user', but that's wrong)
  req.flash() is using req.session object, which has to be created using client-sessions
  https://github.com/jaredhanson/passport/blob/0b3931330e245d8e8851328a7dc436433d6411c9/lib/middleware/authenticate.js#L171

``` javascript
app.use(sessions({
  cookieName: 'session',     
  secret: secret,
  duration: 1 * 60 * 60 * 1000,                                  
  activeDuration: 0.5 * 60 * 60 * 1000,                          
  cookie: {
    path: '/',
    ephemeral: true,
    httpOnly: true,
    secure: false
  }
}));
```


8. models.js
- create user schema and export User model
- create mongoose middleware for hashing (careful with arrow functions)
  http://mongoosejs.com/docs/middleware.html
  https://github.com/Automattic/mongoose/issues/3333
  https://github.com/Automattic/mongoose/issues/3379
- create model instance method for verification
  http://mongoosejs.com/docs/guide.html

- use argon2 for hashing
  https://github.com/ranisalt/node-argon2


9. routes.js
- create simple registration and login GET routes
- create dashboard route


10. server.js
- setup passport
  http://www.passportjs.org/docs/

``` javascript
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
```

- app setup needs to be in the order sessions > flash > passport
- req.flash() or req.flash errors will generally occur if:
  - there is no session store
  - no cookie is served
  - app.use of session, flash, and passport middleware is in a strange order

    https://github.com/keystonejs/keystone/issues/1674
    https://github.com/passport/express-4.x-local-example/issues/8
    https://stackoverflow.com/questions/36087350/typeerror-req-flash-is-not-a-function-using-passport-with-nodejs-username-an?rq=1&utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa


11. passport.js
- require passport, configure passport strategy
- expose passport with module.exports and import in server.js

- passReqToCallback is not in the official documentation
- Easy Authentication with Node passport configuration is used as model for registration strategy
  http://www.passportjs.org/docs/
  https://github.com/jaredhanson/passport
  https://scotch.io/tutorials/easy-node-authentication-setup-and-local
  https://stackoverflow.com/questions/11784233/using-passportjs-how-does-one-pass-additional-form-fields-to-the-local-authenti?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

- passport and flash create properties on req.session, so setup client-sessions cookie names accordingly
- req.user is created during serialization and deserialization process (passport)

- be selective about what you pass to the done()/next() passport functions
  check req.user and req.session, if passing the entire model to done(null,user)/next(null,user)
``` javascript
// req.session
  { passport: { user: '5b147857d67645eef7c04c7d' },
    flash: {} }
// req.user
  { _id: 5b1476ceeefddfeec79fdc9c,
  username: 'a',
  email: 'a',
  password: '$argon2i$v=19$m=4096,t=3,p=1$eY/tBrsS5jW4feh3ug03sg$zLVS4l6FY0GZGjXpT0Y43be8Kh0wWfQYLbC3VPN7Slk',
  __v: 0 }
```


12. routes.js
- add login and registration POST routes  
- add logout route and check how it works along with client-sessions
  http://www.passportjs.org/docs/logout/
  https://github.com/jaredhanson/passport/issues/185
- req.session.reset() is not enough to remove a cookie (client-sessions)
- req.logout() has to be used (provided by passport)

- make dashboard a protected route
  req.isAuthenticated() is not in the official documentation
  https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74

- flash messages usage
  https://github.com/jaredhanson/connect-flash


13. Procfile
```
web: node server.js
```


14. heroku cli
- if not using heroku toolbelt:
  git remote add heroku git.heroku.com:arcane-plains-74809.git

- otherwise:
  heroku create
  https://arcane-plains-74809.herokuapp.com/
  https://git.heroku.com/arcane-plains-74809.git

```
git push heroku HEAD:master
heroku open
heroku logs --tail
heroku config:set SECRET=tajemstvi NODE_ENV=production
heroku config:get MONGODB_URI
heroku addons:create mongolab:sandbox
```

https://elements.heroku.com/addons/mongolab
https://github.com/scotch-io/node-mongoose-heroku


15. bootstrap
- starter template
  https://getbootstrap.com/docs/4.0/getting-started/introduction/



#### From Passport docs
* passport only authenticates requests
* passport strategies are authentication mechanisms and are packaged as individual modules
* these strategies have to be configured before asking passport to authenticate requests
* when passport authenticates a request, it parses the credentials in the request, and then invokes the strategy's verify callback with those credentials as arguments

* strategy's verify callback
  * purpose of a verify callback is to find a user that possesses a set of credentials
  * verify callback accepts username and password args from req.body (username and password will be accessible to passport without the use of passReqToCallback option)
  * verify callbacks have to take care of cases involving server exceptions (non-null error values) and invalid credentials
  * if credentials are valid, verify callback invokes done()/next() to supply passport with the user to be authenticated (done(null, user))
* sessions
  * in order to support login sessions, passport serializes and deserializes user instances to and from the session
  * each subsequent request will not contain credentials, but a unique cookie identifying a session (cookie stores a session id)
  * when subsequent requests are received, this id is used to find the user, which will be restored to req.user
  * if enabled, use session middleware before passport.session middleware, to ensure that the login session is restored in the correct order


#### Extra resources
* notes on req.flash() and passport
  https://github.com/jaredhanson/passport-local/issues/4
* async bcrypt
  https://gist.github.com/BinaryMuse/7983335
* notes client-side sessions
  https://github.com/expressjs/cookie-session/issues/52#issuecomment-174142222
* passport.session()
  https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do
* heroku and https
  https://stackoverflow.com/questions/25148507/https-ssl-on-heroku-node-express?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
