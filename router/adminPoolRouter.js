const express = require('express');

class adminPoolRouter{
    constructor(service){
        this.service = service;
    }
    router(){
        const router = express.Router();
        router.get('/',async (req,res)=>{
            let result = await this.service.getPool();
            console.log('result',result);
            res.send(result);
        });
        router.post('/scheduleCheck',async (req,res)=>{
            try {
                console.log('body',req.body);
                let num = await this.service.getNumSchedule(req.body);
                let poolCapacity = await this.service.getPoolCapacity(req.body.item_id);
                let forNum = parseInt(num[0].sum) + parseInt(req.body.people);
                console.log('forecast num', forNum);
                console.log('capacity',poolCapacity[0].capacity);
                if(forNum>poolCapacity[0].capacity){
                    res.send(false);
                }else{
                    res.send(true);
                }
            } catch (error) {
                console.log('schedule check',error)
            }
        })
        router.post('/schedule',async (req,res)=>{
            try {
                console.log('book pool',req.body);
                let classCourseId = req.body.class_course_id;
                delete req.body.class_course_id;
                req.body.pool_id = req.body.bookingItem_id;
                delete req.body.bookingItem_id;
                let result = await this.service.bookPool(req.body);
                console.log('done booking',result);
                res.redirect(`/admin/course/schedule/${classCourseId}`);
            } catch (error) {
                console.log('book schedule',error);
            }
        })
        router.get('/course/:id',async (req,res)=>{
            try {
                //console.log('course',req.params);
                let classCourseId = req.params.id;
                let classList = await this.service.getClassList(classCourseId);
                //console.log('classList',classList);
                let instructorNamePromises = [];
                let poolListPromises = [];
                for(let i=0;i<classList.length;i++){
                    let courseId = classList[i].id;
                    let instructorId = classList[i].instructor_id;
                    instructorNamePromises.push(this.service.getInstructorName(instructorId));
                    poolListPromises.push(this.service.getPoolBooking(courseId));
                }
                let poolResult = await Promise.all(poolListPromises);
                let instructorResult = await Promise.all(instructorNamePromises);
                //console.log('poolResult', poolResult);
                //console.log('instructorResult', instructorResult);
                let result = [];
                for(let j =0;j<instructorResult.length;j++){
                    for(let k=0;k<poolResult[j].length;k++){
                        let newResult = {
                            instructor:instructorResult[j][0].full_name,
                            booking_date:poolResult[j][k].booking_date,
                            booking_session:poolResult[j][k].booking_session,
                            pool_id:poolResult[j][k].pool_id,
                            num_people:poolResult[j][k].people
                        }
                        result.push(newResult);
                    }
                }
                let poolList = await this.service.getPool();
                for(let i=0;i<result.length;i++){
                    for(let j=0;j<poolList.length;j++){
                        if(result[i].pool_id==poolList[j].id){
                            delete result[i].pool_id;
                            result[i].item = poolList[j].name;
                        }
                    }
                }
                //console.log('total',result);
                res.send(result);
            } catch (error) {
                console.log('getting pool schedule by class course id',error);
            }
        })





        return router;
    }
}

module.exports = adminPoolRouter;