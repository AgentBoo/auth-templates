### Node authentication template
This setup is based on an [article](https://hacks.mozilla.org/2012/12/using-secure-client-side-sessions-to-build-simple-and-scalable-node-js-applications-a-node-js-holiday-season-part-3/) about client-sessions module.


#### Comments:
* This boilerplate code is centered around the use of client-sessions, argon2, mongoose, and passport
* In order to accomodate for argon2, mongoose middleware was used for hashing passwords, prior to saving new user instances
* Express Router is used to plug in routes
* Client-sessions req['sessionName'].reset() is not enough for logging users out. Passport provided req.logout() has to be used instead
* Passport uses the done() function, which is the express equivalent of next() for express middlewares (?)
* Passport uses the local strategy
* Passport serialization and deserialization takes care of the creation of req.user
* Passport documentation does not mention neither req.isAuthenticated() function nor passReqToCallback param, so check out the source code for passport  
* Passport documentation has snippets that use the entire User instance, returned from a database, to pass around for authentication and serialization/deserialization, which seems excessive. User ID should be the most that is passed around.  



#### Sources:
* [Tutorial for password resets](http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/)
* [Addendum on authentications](https://hackernoon.com/your-node-js-authentication-tutorial-is-wrong-f1a3bf831a46)
* [OWASP Password Storage Cheat Sheet](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet)
