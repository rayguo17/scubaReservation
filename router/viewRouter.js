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
        




        return router;
    }
}

module.exports = ViewRouter;