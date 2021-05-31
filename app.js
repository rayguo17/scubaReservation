const express = require('express');
require('dotenv').config();
const redis=require('redis');
const redisClient = redis.createClient({
    host:process.env.REDISHOST,
    port:process.env.REDISPORT
});

const setupApp = require('./utils/init-app');
const setupSession = require('./utils/init-sessions');
const passport = require('./utils/strategies/index');
const ViewRouter = require('./router/viewRouter');

const port = process.env.PORT || 8000;
const app = express();

setupApp(app);
setupSession(app,redisClient);

app.use(passport.initialize());
app.use(passport.session());

//set up routes for each feature 
app.use('/',new ViewRouter().router());

app.listen(port,()=>{
    console.log(`server running on port ${port}...`);
})

//only editting the use of router is permitted, but still can do more setup if needed