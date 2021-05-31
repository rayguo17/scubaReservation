const passport = require('passport');
const localLogin = require('./localStrategy').Login;
const LocalSignup = require('./localStrategy').Signup;

const serializeUser = require('./serializeDeserializeUser').serializeUser;
const deserializeUser = require('./serializeDeserializeUser').deserializeUser;

passport.use('local-login',localLogin);
passport.use('local-signup',LocalSignup);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

module.exports = passport;