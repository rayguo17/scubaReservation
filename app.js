const express = require('express');
const handlebars = require("express-handlebars");
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
app.engine(
    "handlebars",
    handlebars({ defaultLayout: "main" })
);
app.set("view engine", "handlebars");
app.use(express.static("public"));

//set up routes for each feature 
app.use('/',new ViewRouter().router());
app.get("/", (request, response) => {
    response.render("index");
});
app.get("/fundiving", (request, response) => {
    response.render("fundiving");
});
app.get("/course", (request, response) => {
    response.render("course");
});
app.get("/instructor", (request, response) => {
    response.render("instructor");
});
app.get("/faq", (request, response) => {
    response.render("faq");
});

app.listen(port,()=>{
    console.log(`server running on port ${port}...`);
})

//only editting the use of router is permitted, but still can do more setup if needed