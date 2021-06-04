const express = require('express');

class adminCourseRouter{
    constructor(service){
        this.service=service
    }
    router(){
        const router = express.Router();
        router.get('/',async(req,res)=>{
            let result = await this.service.getCourse();
            console.log('course',result);
            res.send(result);
        })
        router.get('/schedule',async (req,res)=>{
            
            let result = await this.service.getAllSchedule();
            console.log(result);
            res.send(result);
        })


        return router;
    }
}

module.exports = adminCourseRouter;