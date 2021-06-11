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
        router.get('/login',(req,res)=>{
            res.render('adminLogin',{layout:'register'});
        });
        router.get('/signup',(req,res)=>{
            res.render('adminSignup',{layout:'register'})
        })
        router.get('/',isLoggedIn,(req,res)=>{
            
            res.render('adminDashboard',{layout:'admin'});
        });
        router.get('/course',isLoggedIn,(req,res)=>{
            //console.log(req.session)
            res.render('adminCourse',{layout:'admin'});
        });
        router.get('/classroom',isLoggedIn,(req,res)=>{
            
            res.render('adminClassroom',{layout:'admin'});
        })
        router.get('/boat',isLoggedIn,(req,res)=>{
            
            res.render('adminBoat',{layout:'admin'});
        })
        router.post('/login',passport.authenticate('admin-login',{
            successRedirect:'/admin/course',
            failureRedirect:'/admin/signup'
        }))
        router.post('/signup',passport.authenticate('admin-signup',{
            successRedirect:'/admin/course',
            failureRedirect:'/admin/login'
        }))
        
        router.get('/course/schedule/:id',isLoggedIn,(req,res)=>{
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