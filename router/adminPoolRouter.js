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
        router.get('/schedule/events',async(req,res)=>{
            try {
                let allSchedule = await this.service.getAllSchedule();
                console.log('allSchedule',allSchedule);
                let getInstructorPromises = [];
                let getClassCoursePromises = [];
                let getSchedulePromises = [];
                for(let i=0;i<allSchedule.length;i++){
                    getSchedulePromises.push(this.service.getScheduleById(allSchedule[i].schedule_id));
                }
                let scheduleResults = await Promise.all(getSchedulePromises);
                console.log('scheduleResults',scheduleResults);
                for(let i=0;i<scheduleResults.length;i++){
                    getInstructorPromises.push(this.service.getInstructorName(scheduleResults[i][0].instructor_id));
                    getClassCoursePromises.push(this.service.getClassCourseById(scheduleResults[i][0].class_course_id));
                }
                let getInstuctorResult = await Promise.all(getInstructorPromises);
                let getClassCourseResult = await Promise.all(getClassCoursePromises);
                console.log('getInstructorResult', getInstuctorResult);
                console.log('getclassCourseResult', getClassCourseResult);
                let result = [];
                for (let i = 0; i < allSchedule.length; i++) {
                    let bookingDate = new Date(allSchedule[i].booking_date);
                    bookingDate.setDate(bookingDate.getDate() + 1);
                    let startDate = new Date(getClassCourseResult[i][0].start_date);
                    startDate.setDate(startDate.getDate() + 1);
                    let newEvent = {
                        booking_date: bookingDate,
                        booking_session: allSchedule[i].booking_session,
                        pool_id: allSchedule[i].pool_id,
                        class_course_id: getClassCourseResult[i][0].id,
                        instructor_name: getInstuctorResult[i][0].full_name,
                        course_id: getClassCourseResult[i][0].course_id,
                        booking_id: allSchedule[i].id,
                        start_date: startDate
                    }
                    result.push(newEvent);
                }
                console.log('formatted Result', result);
                res.send(result);
            } catch (error) {
                console.log('get pool events',error);
            }
        })
        router.delete('/schedule',async(req,res)=>{
            try {
                console.log(req.body);
                let result = await this.service.deleteSchedule(req.body.bookingId);
                console.log('delete', result);
                res.send('done');
            } catch (error) {
                console.log('delete pool schedule',error);
            }
        })





        return router;
    }
}

module.exports = adminPoolRouter;