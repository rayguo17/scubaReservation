const express = require('express');
const passport = require('passport');
const isLoggedIn  = require('../utils/guard');

class ViewRouter {
    router(){
        const router = express.Router();
        router.use(express.urlencoded({extended:false}));
        router.get('/',(req,res)=>{
            
            res.render('index');
        });
        router.get('/admin',(req,res)=>{
            console.log('index',res);
            res.render('index',{layout:'admin'});
        })




        return router;
    }
}

module.exports = ViewRouter;