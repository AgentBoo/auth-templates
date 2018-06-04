### Node authentication template
This setup is based on the [Easy Node Authentication tutorial on Scotch](https://github.com/scotch-io/easy-node-authentication/tree/local)

### Comments
* Deviations from the original tutorial are as follows:
  * This setup uses argon2 as opposed to bcrypt
  * Because of the use of argon2, the hashing function is not a user schema instance method, but a pre-save method (mongoose middleware)
  * This setup uses express.Router() with all routes setup on the router
  * Passport is not passed in for configuration from the main server.js script -- instead, it is imported from passport module into passport.js script and exported as a configured passport into server.js
  * views and assets are different from the original tutorial, including the use of a different template engine

  * instead of defining a specific passport strategy and mongoose instance methods, the use of [passport-local-mongoose](https://github.com/saintedlama/passport-local-mongoose) should be considered

#### Sources:
* [Easy Node Authentication](https://github.com/scotch-io/easy-node-authentication/tree/local)
* [Addendum on authentications](https://hackernoon.com/your-node-js-authentication-tutorial-is-wrong-f1a3bf831a46)
* [OWASP Password Storage Cheat Sheet](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet)
