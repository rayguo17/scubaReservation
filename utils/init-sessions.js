const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const RedisStore = require('connect-redis')(expressSession);

module.exports = (app,redisClient)=>{
    
    const sessionStore = new RedisStore({
        client: redisClient,
        unset:'destroy'
    })
    const settings = {
        resave:false,
        saveUninitialized:true,
        secret:'gusdapperton',
        store:sessionStore,
        cookie:{'path':'/',"httpOnly":true,'secure':false,'maxAge':60*1000*60*5,signed:true}
        
    }
    app.use(cookieParser('gusdapperton'));
    app.use(expressSession(settings));
}