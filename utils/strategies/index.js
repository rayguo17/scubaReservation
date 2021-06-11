const passport = require('passport');
const localLogin = require('./adminStrategy').Login;
const LocalSignup = require('./adminStrategy').Signup;

const serializeUser = require('./serializeDeserializeUser').serializeUser;
const deserializeUser = require('./serializeDeserializeUser').deserializeUser;

passport.use('admin-login',localLogin);
passport.use('admin-signup',LocalSignup);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

module.exports = passport;