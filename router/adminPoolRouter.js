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
        });
        router.get('/gear/events',async(req,res)=>{
            try {
                let allSchedule = await this.service.getAllSchedule();
                let result = [];
                console.log('all schedule',allSchedule);
                let getOrderPromises = [];
                let getSchedulePromises = [];
                for(let i=0;i<allSchedule.length;i++){
                    let schedule_id = allSchedule[i].schedule_id;
                     getOrderPromises.push(this.service.getOrderByScheduleId(schedule_id));
                    getSchedulePromises.push(this.service.getScheduleById(schedule_id));
                }
                let orderResult = await Promise.all(getOrderPromises);
                let scheduleResults = await Promise.all(getSchedulePromises);
                console.log('orderResult',orderResult);
                console.log('scheduleResult',scheduleResults);
                let getInstructorPromises = [];
                let getClassCoursePromises = [];
                for(let i=0;i<scheduleResults.length;i++){
                    getInstructorPromises.push(this.service.getInstructorName(scheduleResults[i][0].instructor_id));
                    getClassCoursePromises.push(this.service.getClassCourseById(scheduleResults[i][0].class_course_id));
                }
                let getInstuctorResult = await Promise.all(getInstructorPromises);
                let getClassCourseResult = await Promise.all(getClassCoursePromises);
                console.log('getInstructorResult', getInstuctorResult);
                console.log('getclassCourseResult', getClassCourseResult);
                let getStudentOrderPromises = [];
                for(let i=0;i<orderResult.length;i++){
                    for(let j=0;j<orderResult[i].length;j++){
                        let orderId = orderResult[i][j].id;
                        getStudentOrderPromises.push(this.service.getStudentByOrderId(orderId));
                    }
                }
                let studentOrderResult = await Promise.all(getStudentOrderPromises);
                console.log('studentOrderResult',studentOrderResult);
                let getStudentNamePromises = [];
                let getStudentGearsPromises = [];
                for(let i=0;i<studentOrderResult.length;i++){
                    for(let j =0;j<studentOrderResult[i].length;j++){
                        let studentId = studentOrderResult[i][j].student_id;
                        getStudentNamePromises.push(this.service.getStudentNameById(studentId));
                        getStudentGearsPromises.push(this.service.getStudentGearById(studentId));
                    }
                }
                let studentNameResult = await Promise.all(getStudentNamePromises);
                let studentGearResult = await Promise.all(getStudentGearsPromises);
                console.log('studentNameResult',studentNameResult);
                console.log('studentGearResult',studentGearResult);
                let flattenFlag = 0;
                for(let i=0;i<allSchedule.length;i++){
                    let newResult = {
                        booking_session:allSchedule[i].booking_session,
                        resourceId:allSchedule[i].pool_id,
                        start:allSchedule[i].booking_date,
                        course_id:getClassCourseResult[i][0].course_id,
                        instructor_name:getInstuctorResult[i][0].full_name,
                        students:[]
                    }
                    let studentList =[];
                    for(let j =0;j<orderResult[i].length;j++){
                        console.log('the same order',j);

                        for(let k=0;k<studentOrderResult[i*orderResult[i].length+j].length;k++){
                            console.log('most inner place',k,studentOrderResult[i*orderResult[i].length+j][k]);
                            let formatStudent = {
                                id:studentGearResult[flattenFlag][0].student_id,
                                name:studentNameResult[flattenFlag][0].full_name,
                                mask:studentGearResult[flattenFlag][0].mask,
                                regulator:studentGearResult[flattenFlag][0].regulator,
                                bcd:studentGearResult[flattenFlag][0].bcd,
                                wetsuit:studentGearResult[flattenFlag][0].wetsuit,
                                boots:studentGearResult[flattenFlag][0].boots,
                                fins:studentGearResult[flattenFlag][0].fins,
                                others:studentGearResult[flattenFlag][0].others
                            }
                            studentList.push(formatStudent);
                            flattenFlag++;
                        }
                    }
                    newResult.students=studentList;
                    result.push(newResult);
                }
                console.log('summup',result);
                res.send(result);
            } catch (error) {
                console.log('getting gear for pool events',error)
            }
        })





        return router;
    }
}

module.exports = adminPoolRouter;