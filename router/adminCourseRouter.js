const express = require('express');

class adminCourseRouter {
    constructor(service) {
        this.service = service
    }
    router() {
        const router = express.Router();
        router.get('/', async (req, res) => {
            let result = await this.service.getCourse();
            //console.log('course',result);
            res.send(result);
        })
        router.get('/schedule', async (req, res) => {
            //console.log('in get route', req.session)
            let result = await this.service.getAllSchedule();
            //console.log('schedule', result);
            res.send(result);
        })
        router.post('/schedule', async (req, res) => {
            //date store in database and get different when getting out
            //console.log('this is req', new Date(req.body.start_date));
            let result = await this.service.addClassCourse(req.body);
            res.redirect('/admin/course');

        })
        router.get('/schedule/:id', async (req, res) => {
            //console.log('this is req',req.params);
            let result = await this.service.getClassCourse(req.params.id);

            //console.log(result);
            res.send(result);
        })
        router.post('/class', async (req, res) => {
            try {
                console.log(req.body);
                let newCourseSchedule = { class_course_id: req.body.class_course_id, instructor_id: req.body.instructor_id };
                let courseScheduleId = await this.service.addCourseSchedule(newCourseSchedule);
                //console.log('courseScheduleId', courseScheduleId[0]);

                if (req.body.full_name instanceof Array) {
                    let promises = [];
                    for (let i = 0; i < req.body.full_name.length; i++) {
                        let newCourseORder = {
                            course_schedule_id: courseScheduleId[0],
                            num_people: req.body.num_people[i],
                            phone_number: req.body.phone_number[i],
                            email: req.body.email[i],
                            full_name: req.body.full_name[i]
                        }
                        let result = this.service.addClassSchedule(newCourseORder);
                        promises.push(result);

                    }
                    Promise.all(promises).then((data) => {
                        //console.log('course_order_id', data);
                        res.redirect(`/admin/course/schedule/${req.body.class_course_id}`)
                    })
                } else {
                    let newCourseOrder = {
                        course_schedule_id: courseScheduleId[0],
                        num_people: req.body.num_people,
                        phone_number: req.body.phone_number,
                        email: req.body.email,
                        full_name: req.body.full_name
                    }
                    let result = await this.service.addClassSchedule(newCourseOrder);
                   // console.log('course_order_id', result);
                    res.redirect(`/admin/course/schedule/${req.body.class_course_id}`)
                }

            } catch (err) {
                console.log(err);
            }



            //let result = await this.service.addClassSchedule()
        })
        router.get('/schedule/:id/class', async (req, res) => {
            try {
                //console.log('params', req.params);
                let result = await this.service.getClassList(req.params.id);
                //console.log(result)
                res.send(result);
            } catch (err) {
                console.log(err);
            }

        })
        router.get('/class/:id',async (req,res)=>{
            try {
                //console.log('get Course order to schedule',req.params);
                let result = await this.service.getOrderList(req.params.id);
                //console.log('get Course order to schedule',result);
                res.send(result);
            } catch (err) {
                console.log(err);
            }
        })
        router.post('/class/student',async (req,res)=>{
            try {
                console.log(req.body);
                let studentIdList = [];
                if(req.body.student_email instanceof Array){
                    let getStudentPromises = [];
                    for(let i=0;i<req.body.student_email.length;i++){
                        let getStudent = this.service.getStudentByEmail({
                            email:req.body.student_email[i]
                        });
                        getStudentPromises.push(getStudent);
                    }
                    let gotStudent = await Promise.all(getStudentPromises);
                    console.log(gotStudent);
                    for(let i=0;i<gotStudent.length;i++){
                        if(gotStudent[i][0]){//if this student does not exist we just skip
                            studentIdList.push(gotStudent[i][0].id);
                        }
                        
                    }
                    console.log(studentIdList);
                }else{
                    let getStudent = await this.service.getStudentByEmail({
                        email:req.body.student_email
                    })
                    console.log(getStudent);
                    
                    if(getStudent[0]){
                        let studentId = getStudent[0].id;
                        studentIdList.push(studentId);
                    }
                    
                    
                }
                if(!req.body.name){
                    let addOrderPromises = [];
                   for(let i =0;i<studentIdList.length;i++){
                     let newOrder = {
                         course_order_id:req.body.orderId,
                         student_id:studentIdList[i]
                     }
                     addOrderPromises.push(this.service.addStudentOrder(newOrder));
                   }
                   let result = await Promise.all(addOrderPromises);
                   console.log('result without newStudent',result);
                   return  res.redirect(`/admin/course/schedule/${req.body.class_course_id}`);
                }else{

                    if(req.body.name instanceof Array){
                        let addStudentPromises = [];
                        for(let i=0;i<req.body.name.length;i++){
                            let newStudent = {
                                full_name:req.body.name[i],
                                email:req.body.email[i],
                                phone_number:req.body.phone[i]
                            }
                            let addNewStudent = this.service.addStudent(newStudent);
                            addStudentPromises.push(addNewStudent);

                        }
                        let returnStudentId = await Promise.all(addStudentPromises);
                        console.log('returningStudentIds',returnStudentId);
                        let addStudentGearPromises = [];
                        for(let i=0;i<returnStudentId.length;i++){
                            let studentId = returnStudentId[i][0]
                            studentIdList.push(studentId);
                            let mask = false;
                            let regulator=false;
                            
                            if(req.body.mask[i]=='on'){
                                mask = true;
                            }
                            if(req.body.regulator[i]=='on'){
                                regulator = true;
                            }
                            let newStudentGear = {
                                student_id:studentId,
                                mask:mask,
                                regulator:regulator,
                                bcd:req.body.bcd[i],
                                wetsuit:req.body.wetsuit[i],
                                boots:req.body.boots[i],
                                fins:req.body.fins[i],
                                others:req.body.others[i]
                            }
                            addStudentGearPromises.push(this.service.addStudentGear(newStudentGear));
                        }
                        let studentGearResult = await Promise.all(addStudentGearPromises);
                        console.log('studentGearResult',studentGearResult);
                        let addOrderPromises = [];
                        for(let i =0;i<studentIdList.length;i++){
                            let newOrder = {
                                course_order_id:req.body.orderId,
                                student_id:studentIdList[i]
                            }
                            addOrderPromises.push(this.service.addStudentOrder(newOrder));
                          }
                          let result = await Promise.all(addOrderPromises);
                          console.log('result with newStudent Array',result);
                          return  res.redirect(`/admin/course/schedule/${req.body.class_course_id}`);
                    }else{
                        let newStudent = {
                            full_name:req.body.name,
                                email:req.body.email,
                                phone_number:req.body.phone
                        }
                        let returnStudentId = await this.service.addStudent(newStudent);
                        let newStudentId = returnStudentId[0];
                        studentIdList.push(newStudentId);
                        let mask =false;
                        let regulator = false;
                        if(req.body.mask=='on'){
                            mask = true;
                        }
                        if(req.body.regulator=='on'){
                            regulator = true;
                        }
                        let newStudentGear = {
                            student_id:newStudentId,
                                mask:mask,
                                regulator:regulator,
                                bcd:req.body.bcd,
                                wetsuit:req.body.wetsuit,
                                boots:req.body.boots,
                                fins:req.body.fins,
                                others:req.body.others
                        }
                        let addStudentGear = await this.service.addStudentGear(newStudentGear);
                        console.log('studentGearResult',addStudentGear);
                        let addOrderPromises = [];
                        for(let i =0;i<studentIdList.length;i++){
                            let newOrder = {
                                course_order_id:req.body.orderId,
                                student_id:studentIdList[i]
                            }
                            addOrderPromises.push(this.service.addStudentOrder(newOrder));
                          }
                          let result = await Promise.all(addOrderPromises);
                          console.log('result with newStudent',result);
                         return  res.redirect(`/admin/course/schedule/${req.body.class_course_id}`);
                    }
                }
                
                
                
            } catch (err) {
                console.log(err);
            }
        })
        router.get('/order/:id',async (req,res)=>{
            console.log(req.params);
            let orderId = req.params.id;
            let result = await this.service.getStudentByOrder(orderId);
            console.log('getStudentResult',result);
            res.send(result);
        })  

        return router;
    }
}

module.exports = adminCourseRouter;