const express = require('express');
const knex = require('knex');
const passport = require('passport');
const isLoggedIn  = require('../utils/guard');

class AdminViewRouter {
    constructor(knex){
        this.knex=knex
    }
    router(){
        const router = express.Router();
        router.use(express.urlencoded({extended:false}));
        router.get('/',(req,res)=>{
            
            res.render('index',{layout:'admin'});
        });
        router.get('/course',(req,res)=>{
            console.log(res.session)
            res.render('adminCourse',{layout:'admin'});
        });
        router.get('/classroom',(req,res)=>{
            
            res.render('adminClassroom',{layout:'admin'});
        })
        router.get('/course/:course_id/schedule',async (req,res)=>{
            try {
                
                console.log('para',req.params);
            let course_id=req.params.course_id;
            let dataCourse = await this.knex('course').select('course_name').where('id',course_id);
            let courseName = dataCourse[0].course_name;
            let dataSchedule = await this.knex('course_schedule').innerJoin('course',{'course.id':'course_id'})
                        .innerJoin('instructors',{'instructors.id':'instructor_id'})
                        .select(['course_schedule.*',this.knex.raw('to_json(course.*) as course'),this.knex.raw('to_json(instructors.*) as instructor')])
                        .where({course_id:course_id}).where('start_date','>=',new Date(Date.now()));
            console.log('dataSchedule',dataSchedule);
            let schedule =[];
            console.log(new Date(dataSchedule[0].start_date));
            for(let i=0;i<dataSchedule.length;i++){
                schedule.push({start_date:new Date(dataSchedule[i].start_date).toDateString(),id:dataSchedule[i].id,instructor:dataSchedule[i].instructor.username})
            }
            res.render('adminCourseSchedule',{layout:'admin',courseName:courseName,schedule:schedule});

            } catch (error) {
                console.log(error);
            }
            
            
        })
        router.get('/course/schedule/:id',(req,res)=>{
            try {
                //console.log(req.params);
                res.render('adminCourseSchedule',{layout:'admin',class_course_id:req.params.id});
            } catch (error) {
                console.log(error);
            }
        })



        return router;
    }
}

module.exports = AdminViewRouter;