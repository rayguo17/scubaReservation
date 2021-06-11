const express = require('express');
const handlebars = require("express-handlebars");
require('dotenv').config();
const redis=require('redis');
const redisClient = redis.createClient({
    host:process.env.REDISHOST,
    port:process.env.REDISPORT
});
const development = require('./knexfile').development;
const knex = require('knex')(development);

const setupApp = require('./utils/init-app');
const setupSession = require('./utils/init-sessions');
const passport = require('./utils/strategies/index');
const ViewRouter = require('./router/viewRouter');
const AdminViewRouter = require('./router/adminViewRouter');
const AdminCourseService = require('./service/adminCourseService');
const AdminCourseRouter = require('./router/adminCourseRouter');
const AdminClassroomService = require('./service/adminClassroomService');
const AdminClassroomRouter = require('./router/adminClassroomRouter');
const AdminInstructorService = require('./service/adminInstructorService');
const AdminInstructorRouter = require('./router/adminInstructorRouter');

const port = process.env.PORT || 8000;
const app = express();

setupApp(app);
setupSession(app,redisClient);

app.use(passport.initialize());
app.use(passport.session());
// app.engine(
//     "handlebars",
//     handlebars({ defaultLayout: "main" })
// );
// app.set("view engine", "handlebars");
// app.use(express.static("public"));


//set up routes for each feature 
app.use('/',new ViewRouter().router());
app.use('/admin',new AdminViewRouter(knex).router());
app.use('/admin/api/course',new AdminCourseRouter(new AdminCourseService(knex)).router());
app.use('/admin/api/classroom',new AdminClassroomRouter(new AdminClassroomService(knex)).router());
app.use('/admin/api/instructor',new AdminInstructorRouter(new AdminInstructorService(knex)).router());
app.get("/", (request, response) => {
    response.render("index");
});


app.get("/courses-junior", (request, response) => {
  response.render("coursesJunior");
});

app.get("/courses-beginner", (request, response) => {
  response.render("coursesBeginner");
});

app.get("/courses-advanced", (request, response) => {
  response.render("coursesAdvanced");
});

app.get("/courses-prolevel", (request, response) => {
  response.render("coursesProLevel");
});

app.get("/courses-specialty", (request, response) => {
  response.render("coursesSpecialty");
});

app.get("/courses-reactivate", (request, response) => {
  response.render("coursesReActivate");
});

app.get("/localBoatSchedule", (request, response) => {
  response.render("localBoatSchedule")
});

app.get("/localEquipment", (request, response) => {
  response.render("localEquipment");
});

app.get("/localDiveSites", (request, response) => {
  response.render("localDiveSites");
});

app.get("/pool", (request, response) => {
  response.render("pool");
});
app.get("/instructor", (request, response) => {
    response.render("instructor");
});
app.get("/gallery", (request, response) => {
  response.render("gallery");
});
app.get("/faq", (request, response) => {
    response.render("faq");
});

app.listen(port,()=>{
    console.log(`server running on port ${port}...`);
})

//only editting the use of router is permitted, but still can do more setup if needed