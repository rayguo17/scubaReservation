const express = require('express')

class adminClassroomRouter{
    constructor(service){
        this.service = service;
    }
    router(){
        const router = express.Router();
        router.get('/', async (req,res)=>{
            let result = await this.service.getClassroom();
            res.send(result);
        });
        router.get('/schedule',async(req,res)=>{
            let result = await this.service.getAllSchedule();
            res.send(result);
        })


        return router;
    }

}

module.exports = adminClassroomRouter;